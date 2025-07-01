import { existsSync, PathLike } from 'fs';
import * as fs from 'node:fs/promises';
import * as path from 'path';

import fileTypeMap from './fileTypeMap';

import {
	FileEntry,
	FilePermissions,
	FileTypes,
	FileTypesWithPreview,
	GetDataResult,
} from '@/types';
import { log } from '@/lib/log';

function resolveWithBaseDir(baseDir: string, filePath: string) {
	return path.resolve(baseDir, filePath);
}

function getRelativePath(baseDir: string, filePath: string) {
	return path.relative(baseDir, filePath);
}

export function convertParams(params: string[]): string {
	return params.join('/');
}

export async function getData(params: string[]): Promise<GetDataResult> {
	const baseDir = process.env.BASE_DIR || process.cwd();
	const relPath = convertParams(params);
	const filePath = resolveWithBaseDir(baseDir, relPath);

	log.debug('FILE:', filePath);
	if (!existsSync(filePath)) {
		log.info('File not found');

		return {
			kind: 'error',
			errorCode: 'ENOENT',
			msg: 'No such file or directory',
		};
	}

	const permisions = await checkFilePermisions(relPath, baseDir);

	if (permisions === 'EACCES') {
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
			const fullPath = resolveWithBaseDir(baseDir, childRelPath);

			const filePermisions: FilePermissions = await checkFilePermisions(
				childRelPath,
				baseDir,
			);
			const fileType: FileTypes = await checkFileType(childRelPath, baseDir);

			if (filePermisions === 'EACCES') {
				filesInDirectory.push({
					name: file.name,
					path: childRelPath,
					permisions: 'EACCES',
					type: fileType,
				});
				continue;
			}

			const fileDetails = await fs.stat(fullPath);

			filesInDirectory.push({
				name: file.name,
				type: fileType,
				path: childRelPath,
				permisions: filePermisions,
				time: fileDetails.ctime,
				size: fileDetails.size,
			});
		}

		return {
			kind: 'dir',
			name: params[params.length - 1],
			path: relPath,
			children: filesInDirectory,
		};
	}

	if (fileStat.isFile()) {
		const fileType = await checkFileType(relPath, baseDir);

		return {
			kind: 'file',
			name: params[params.length - 1],
			path: relPath,
			type: fileType,
			permisions: permisions,
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

export async function checkFileType(
	relPath: string,
	baseDir: string,
): Promise<FileTypes> {
	const resolvedPath = resolveWithBaseDir(baseDir, relPath);
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

export async function checkFilePermisions(
	relPath: PathLike,
	baseDir?: string,
): Promise<FilePermissions> {
	const base = baseDir || process.env.BASE_DIR || process.cwd();
	const resolvedPath = resolveWithBaseDir(base, relPath.toString());
	const filePermisions: FilePermissions = [];

	try {
		await fs.access(resolvedPath, fs.constants.R_OK);
		filePermisions.push('read');
	} catch {}
	try {
		await fs.access(resolvedPath, fs.constants.W_OK);
		filePermisions.push('write');
	} catch {}
	if (filePermisions.length <= 0) {
		return 'EACCES';
	}

	return filePermisions;
}

export async function writeFiles(type: FileTypesWithPreview) {
	const baseDir = process.env.BASE_DIR || process.cwd();

	for (const file of fileTypeMap[type]) {
		const relPath = `folder/${type}/${type}.${file}`;
		const filePath = resolveWithBaseDir(baseDir, relPath);

		await fs.writeFile(filePath, 'Hi');
	}
}
