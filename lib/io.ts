import { existsSync, PathLike } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import fileTypeMap from './fileTypeMap';

import {
  Result,
  FileEntry,
  FilePermissions,
  FileTypes,
  GetDataResult,
  CopyFileErrorTypes,
  FileErrorTypes,
  DeleteFileResult,
  FileOperationError,
  CopyFileResult,
} from '@/types';
import { FileErrorMap } from '@/types/fileErrors';
import { log } from '@/lib/log';
import { sanitizeUrlPath } from '@/lib/helpers';

const baseDir = process.env.BASE_DIR || process.cwd();

export function getErrorMsg(code: FileErrorTypes) {
  return FileErrorMap[code]?.message || FileErrorMap.UNKNOWN.message;
}

function resolveWithBaseDir(
  filePath: string,
): { ok: true; path: string } | FileOperationError {
  if (/(\.\.(\/|\\))+/g.test(filePath)) {
    return {
      ok: false,
      code: 'EPATHINJECTION',
      msg: '',
    };
  }

  return { ok: true, path: path.resolve(baseDir, filePath) };
}

export function convertParams(params: string[]): string {
  const path = params.join('/');

  return sanitizeUrlPath(path);
}

export async function getData(params: string[]): Promise<GetDataResult> {
  const relPath = convertParams(params);
  const resolvedPath = resolveWithBaseDir(relPath);

  if (!resolvedPath.ok) {
    return {
      kind: 'error',
      code: resolvedPath.code,
      msg: resolvedPath.msg || getErrorMsg(resolvedPath.code),
    };
  }

  if (!existsSync(resolvedPath.path)) {
    return {
      kind: 'error',
      code: 'ENOENT',
      msg: 'No such file or directory',
    };
  }

  const permissions = await checkFilePermissions(relPath);

  if (permissions === 'EACCES') {
    return {
      kind: 'error',
      code: 'EACCES',
      msg: 'Permission denied',
    };
  }

  const fileStat = await fs.stat(resolvedPath.path);

  if (fileStat.isDirectory()) {
    let filesInDirectory: FileEntry[] = [];
    const data = await fs.readdir(resolvedPath.path, { withFileTypes: true });

    for (const file of data) {
      const childRelPath = path.join(relPath, file.name);
      const fullPath = resolveWithBaseDir(childRelPath);

      const filePermissions: FilePermissions =
        await checkFilePermissions(childRelPath);

      const fileType: FileTypes = await checkFileType(childRelPath);

      if (filePermissions === 'EACCES' || !fullPath.ok) {
        filesInDirectory.push({
          name: file.name,
          path: childRelPath,
          permissions: 'EACCES',
          type: fileType,
        });
        continue;
      }

      const fileDetails = await fs.stat(fullPath.path);

      filesInDirectory.push({
        name: file.name,
        type: fileType,
        path: childRelPath,
        permissions: filePermissions,
        time: fileDetails.ctime,
        size: fileDetails.size,
      });
    }

    const sortedFiles = filesInDirectory.sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;

      return a.name.localeCompare(b.name);
    });

    return {
      kind: 'dir',
      name: params[params.length - 1],
      path: relPath,
      children: sortedFiles,
    };
  }

  if (fileStat.isFile()) {
    const fileType = await checkFileType(relPath);

    return {
      kind: 'file',
      name: params[params.length - 1],
      path: relPath,
      type: fileType,
      permissions: permissions,
      size: fileStat.size,
      time: fileStat.ctime,
    };
  }

  return {
    kind: 'error',
    code: 'UNKNOWN',
    msg: 'Could not getData because of an unknown error',
  };
}

export async function checkFileType(relPath: string): Promise<FileTypes> {
  const resolvedPath = resolveWithBaseDir(relPath);

  if (!resolvedPath.ok) {
    return 'other';
  }

  const fileStat = await fs.stat(resolvedPath.path);

  if (fileStat.isDirectory()) {
    return 'dir';
  }
  if (fileStat.isSymbolicLink()) {
    return 'symlink';
  }
  if (fileStat.isFile()) {
    const fileExtension = path.extname(resolvedPath.path);

    for (const [type, extensions] of Object.entries(fileTypeMap)) {
      if (
        extensions.includes(fileExtension.slice(1) /* Remove the first dot */)
      ) {
        return type as FileTypes;
      }
    }
  }

  return 'other';
}

export async function checkFilePermissions(
  relPath: PathLike,
): Promise<FilePermissions> {
  const resolvedPath = resolveWithBaseDir(relPath.toString());

  if (!resolvedPath.ok) {
    log.error('checkFilePermissions(): Invalid path.', relPath);

    return 'EACCES';
  }

  if (!existsSync(resolvedPath.path)) {
    log.error("checkFilePermissions(): File doesn't exist.", relPath);

    return 'ENOENT';
  }

  const permissions: FilePermissions = [];

  try {
    await fs.access(resolvedPath.path, fs.constants.R_OK);
    permissions[0] = 'read';
  } catch {}
  try {
    await fs.access(resolvedPath.path, fs.constants.W_OK);
    permissions[1] = 'write';
  } catch {}
  try {
    await fs.access(resolvedPath.path, fs.constants.X_OK);
    permissions[2] = 'execute';
  } catch {}

  return permissions.some(Boolean) ? permissions : 'EACCES';
}

export async function deleteFile(relPath: string): Promise<DeleteFileResult> {
  const resolvedPath = resolveWithBaseDir(relPath);

  if (!resolvedPath.ok) {
    return { ok: false, error: resolvedPath.code };
  }

  const fullPath = resolvedPath.path;

  if (!existsSync(fullPath)) {
    return { ok: false, error: 'ENOENT' };
  }

  try {
    await fs.rm(fullPath, {
      force: true,
      recursive: true,
    });

    return { ok: true, value: relPath };
  } catch (error: any) {
    const code = (error.code as FileErrorTypes) || 'UNKNOWN';

    return { ok: false, error: code };
  }
}

export async function copyFile(
  source: string,
  destination: string,
  { move }: { move?: boolean } = { move: false },
): Promise<Result<string, CopyFileErrorTypes>> {
  if (!source || !destination) {
    return { ok: false, error: 'MISSING_PATH' };
  }

  const normalizedDest = destination.startsWith('/')
    ? destination.slice(1)
    : destination;

  const srcResolved = resolveWithBaseDir(source);
  const destResolved = resolveWithBaseDir(normalizedDest);

  if (!srcResolved.ok || !destResolved.ok) {
    return { ok: false, error: 'SOURCE_NOT_FOUND' };
  }

  const destinationDir = path.dirname(destResolved.path);

  if (!existsSync(srcResolved.path)) {
    return { ok: false, error: 'SOURCE_NOT_FOUND' };
  }

  if (!existsSync(destinationDir)) {
    return { ok: false, error: 'DEST_DIR_NOT_FOUND' };
  }

  if (existsSync(destResolved.path)) {
    return { ok: false, error: 'DEST_ALREADY_EXISTS' };
  }

  const [srcPerms, destPerms] = await Promise.all([
    checkFilePermissions(srcResolved.path),
    checkFilePermissions(destinationDir),
  ]);

  if (!Array.isArray(srcPerms) || !srcPerms.includes('read')) {
    return { ok: false, error: 'NO_READ_PERMISSION' };
  }

  if (!Array.isArray(destPerms) || !destPerms.includes('write')) {
    return { ok: false, error: 'NO_WRITE_PERMISSION' };
  }

  try {
    if (move) {
      await fs.rename(srcResolved.path, destResolved.path);

      return {
        ok: true,
        value: destResolved.path,
      };
    }
    await fs.cp(srcResolved.path, destResolved.path, { recursive: true });

    return {
      ok: true,
      value: destResolved.path,
    };
  } catch {
    return { ok: false, error: 'COPY_FAILED' };
  }
}

export async function renameFile(
  oldRelPath: string,
  newRelPath: string,
): Promise<CopyFileResult> {
  const oldResolved = resolveWithBaseDir(oldRelPath);
  const newResolved = resolveWithBaseDir(newRelPath);

  if (!oldResolved.ok || !newResolved.ok) {
    return { ok: false, error: 'MISSING_PATH' };
  }

  if (!existsSync(oldResolved.path)) {
    return { ok: false, error: 'SOURCE_NOT_FOUND' };
  }

  if (existsSync(newResolved.path)) {
    return { ok: false, error: 'DEST_ALREADY_EXISTS' };
  }

  const oldPerms = await checkFilePermissions(oldResolved.path);
  const newDir = path.dirname(newResolved.path);
  const newDirPerms = await checkFilePermissions(newDir);

  if (!Array.isArray(oldPerms) || !oldPerms.includes('write')) {
    return { ok: false, error: 'NO_WRITE_PERMISSION' };
  }

  if (!Array.isArray(newDirPerms) || !newDirPerms.includes('write')) {
    return { ok: false, error: 'NO_WRITE_PERMISSION' };
  }

  try {
    await fs.rename(oldResolved.path, newResolved.path);

    return { ok: true, value: newResolved.path };
  } catch {
    return { ok: false, error: 'UNKNOWN' };
  }
}
