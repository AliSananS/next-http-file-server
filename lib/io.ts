import { existsSync, PathLike } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'path';

import fileTypeMap from './fileTypeMap';

import { FileEntry, FilePermissions, FileTypes, GetDataResult } from '@/types';
import { log } from '@/lib/log';

const baseDir = process.env.BASE_DIR || process.cwd();

function resolveWithBaseDir(filePath: string) {
	return path.resolve(baseDir, filePath);
}

export function convertParams(params: string[]): string {
	return params.join('/');
}

export async function getData(params: string[]): Promise<GetDataResult> {
	const relPath = convertParams(params);
	const filePath = resolveWithBaseDir(relPath);

	log.debug('FILE:', filePath);
	if (!existsSync(filePath)) {
		return {
			kind: 'error',
			errorCode: 'ENOENT',
			msg: 'No such file or directory',
		};
	}

	const permissions = await checkFilePermissions(relPath);

	if (permissions === 'EACCES') {
		return {
			kind: 'error',
			errorCode: 'EACCES',
			msg: 'Permission denied',
		};
	}

	const fileStat = await fs.stat(filePath);

	if (fileStat.isDirectory()) {
		let filesInDirectory: FileEntry[] = [];
		const data = await fs.readdir(filePath, { withFileTypes: true });

		for (const file of data) {
			const childRelPath = path.join(relPath, file.name);
			const fullPath = resolveWithBaseDir(childRelPath);

			const filePermissions: FilePermissions =
				await checkFilePermissions(childRelPath);
			const fileType: FileTypes = await checkFileType(childRelPath);

			if (filePermissions === 'EACCES') {
				filesInDirectory.push({
					name: file.name,
					path: childRelPath,
					permissions: 'EACCES',
					type: fileType,
				});
				continue;
			}

			const fileDetails = await fs.stat(fullPath);

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
		errorCode: 'UNKNOWN',
		msg: 'Could not getData because of an unknown error',
	};
}

export async function checkFileType(relPath: string): Promise<FileTypes> {
	const resolvedPath = resolveWithBaseDir(relPath);
	const fileStat = await fs.stat(resolvedPath);

	if (fileStat.isDirectory()) {
		return 'dir';
	}
	if (fileStat.isSymbolicLink()) {
		return 'symlink';
	}
	if (fileStat.isFile()) {
		const fileExtension = path.extname(resolvedPath);

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
	const filePermissions: FilePermissions = [];

	try {
		await fs.access(resolvedPath, fs.constants.R_OK);
		filePermissions.push('read');
	} catch {}
	try {
		await fs.access(resolvedPath, fs.constants.W_OK);
		filePermissions.push('write');
	} catch {}
	if (filePermissions.length <= 0) {
		return 'EACCES';
	}

	return filePermissions;
}

export async function deleteFile(
	relPath: string,
	{ force, recursive }: { force?: boolean; recursive: boolean } = {
		force: false,
		recursive: true,
	},
): Promise<boolean> {
	const resolvedPath = resolveWithBaseDir(relPath);

	if (!existsSync(resolvedPath)) {
		return false;
	}

	try {
		await fs.rm(resolvedPath, { force, recursive });

		return true;
	} catch {
		return false;
	}
}

export async function moveFile(
	source: string,
	destination: string,
	{ force }: { force?: boolean } = { force: false },
): Promise<boolean> {
	const sourcePath = resolveWithBaseDir(source);
	const destinationPath = resolveWithBaseDir(destination);

	if (!existsSync(sourcePath)) {
		return false;
	}

	try {
		await fs.rename(sourcePath, destinationPath);

		return true;
	} catch (error) {
		log.error('Error moving file:', error);

		return false;
	}
}

export async function copyFile(
	source: string,
	destination: string,
): Promise<boolean> {
	const sourcePath = resolveWithBaseDir(source);
	const destinationPath = resolveWithBaseDir(destination);

	if (!existsSync(sourcePath)) {
		return false;
	}

	try {
		await fs.copyFile(sourcePath, destinationPath);

		return true;
	} catch (error) {
		log.error('Error copying file:', error);

		return false;
	}
}
