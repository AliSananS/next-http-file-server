import { readdir, readFile as nodeReadFile, stat } from 'node:fs/promises';
import { existsSync, PathLike } from 'node:fs';

import { FileEntry, FileTypes, ListDirResult } from '@/types';

export function convertParams(params: string[]): PathLike {
    return params.join('/').toString();
}

export async function getData(params: string[]) {
    const filePath = convertParams(params);
    const data = stat(filePath);
}

export async function listDir(params: string[]): Promise<ListDirResult> {
    const path = convertParams(params);

    console.log(path);

    try {
        const data = await readdir(path, { withFileTypes: true });

        const newData: FileEntry[] = [];

        for (const file of data) {
            if (file.isDirectory()) {
                newData.push({
                    name: file.name,
                    type: 'dir',
                    path: file.parentPath + '/' + file.name,
                });
            } else if (file.isFile()) {
                newData.push({
                    name: file.name,
                    type: 'file',
                    path: file.parentPath + '/' + file.name,
                });
            } else if (file.isSymbolicLink()) {
                newData.push({
                    name: file.name,
                    type: 'symlink',
                    path: file.parentPath + '/' + file.name,
                });
            }
        }

        return newData.sort((a, b) =>
            a.type === 'dir' ? (b.type === 'dir' ? 0 : -1) : 1,
        );
    } catch (error: any) {
        console.error(error);

        return {
            error: true,
            errorCode: error.code ?? 'UNKNOWN',
            msg: error,
        };
    }
}

export async function readFile(params: string[]) {
    const path = convertParams(params);

    try {
        const data = await nodeReadFile(path);

        return data;
    } catch (error) {
        return {
            error: true,
            //@ts-ignore
            msg: error.code,
        };
    }
}

export function fileExists(params: string[]) {
    const path = convertParams(params);

    return existsSync(path);
}

export async function getFileInfo(
    params: string[],
): Promise<{ type: FileTypes | 'other' } | null> {
    const path = convertParams(params);

    try {
        const stat = await import('node:fs/promises').then(fs => fs.stat(path));

        if (stat.isDirectory()) return { type: 'dir' };
        if (stat.isFile()) return { type: 'file' };

        return { type: 'other' };
    } catch {
        return null;
    }
}
