import { existsSync, PathLike } from 'fs';
import * as fs from 'node:fs/promises';

import { DirEntery, FileEntry, FilePermissions, FileTypes, FileTypesWithPreview, GetDataResult } from '@/types';
import fileTypeMap from './lib/fileTypeMap';
import { log } from '@/lib/log';

export function convertParams(params: string[]): PathLike {
    return params.join('/').toString();
}

export async function getData(params: string[]): Promise<GetDataResult> {
    const filePath = convertParams(params);

    log.debug("FILE:", filePath);
    if (!existsSync(filePath)) {
        console.error('File not found');

        return {
            error: true,
            errorCode: 'ENOENT',
            msg: 'No such file or directory',
        }
    }

    const permisions = await checkFilePermisions(filePath);

    if (!permisions.includes("read")) {
        return {
            error: true,
            errorCode: "EACCES",
            msg: "Permission denied"
        }
    }
    // Check info of the file or directory.
    const fileStat = await fs.stat(filePath);
    log.debug("statfs:", (await fs.statfs(filePath)).type)

    if (fileStat.isDirectory()) {
        let filesInDirectory: FileEntry[] = [];
        const data = await fs.readdir(filePath, { withFileTypes: true });

        for (const file of data) {
            const path: PathLike | string = file.parentPath + file.name;
            const filePermisions: FilePermissions = await checkFilePermisions(path);
            const fileType: FileTypes = await checkFileType(path);
            const fileDetails = await fs.stat(path);

            filesInDirectory.push({
                name: file.name,
                type: fileType,
                path: path,
                permisions: filePermisions,
                time: fileDetails.ctime,
                size: fileDetails.size,
            });
        }
        const directory: DirEntery = {
            name: params[params.length - 1],
            path: filePath,
            children: filesInDirectory
        }
        return directory;
    }

    if (fileStat.isFile()) {
        const fileType = await checkFileType(filePath);

        const file: FileEntry = {
            name: params[params.length - 1],
            path: filePath,
            type: fileType,
            permisions: permisions,
            size: fileStat.size,
            time: fileStat.ctime,
        }
        return file;
    }
    return {
        error: true,
        errorCode: "UNKNOWN",
        msg: "Could not getData because of an unknown error"
    }
}

export async function checkFileType(filePath: PathLike | string): Promise<FileTypes> {

    const fileStat = await fs.stat(filePath);
    if (fileStat.isDirectory()) {
        log.debug("FileType: Directory");
        return "dir";
    }
    if (fileStat.isSymbolicLink()) {
        log.debug("FileType: Symlink");
        return "symlink";
    }
    if (fileStat.isFile()) {
        const fileExtension = filePath.toString().split('.').pop() || filePath.toString();
        let fileType: FileTypes = 'other';
        for (const [type, extensions] of Object.entries(fileTypeMap)) {
            if (extensions.includes(fileExtension)) {
                fileType = type as FileTypes;
                break;
            }
        }

        log.debug("FileType:", fileType);
        return fileType;
    }
    else {
        log.debug("FileType: Unkown");
        return "other";
    }
}

export async function checkFilePermisions(filePath: PathLike): Promise<FilePermissions> {
    // Check for the permisions.
    const filePermisions: FilePermissions = [];
    try {
        await fs.access(filePath, fs.constants.R_OK);
        filePermisions.push('read');
    }
    catch (_) {
        log.debug(`${filePath}: No read permission.`);
        return "EACCES"
    }
    try {
        await fs.access(filePath, fs.constants.W_OK);
        filePermisions.push('write');
    }
    catch (_) {
        log.debug(`${filePath}: No Write permission.`);
    }

    return filePermisions;
}

export async function writeFiles(type: FileTypesWithPreview) {
    fileTypeMap[type].forEach(async file => {
        await fs.writeFile(`folder/${type}/${type}.${file}`, "Hi");
    })
}