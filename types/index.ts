import { PathLike } from 'fs';

import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};
export type FileTypes =
	| 'dir'
	| 'file'
	| 'symlink'
	| 'video'
	| 'audio'
	| 'text'
	| 'image'
	| 'other';
export type FileTypesWithPreview = Extract<
	FileTypes,
	'video' | 'audio' | 'image' | 'text'
>;

export type FileEntry = {
	name: string;
	type: FileTypes;
	path: PathLike | string;
	permisions: FilePermissions;
	size?: number;
	time?: Date;
};

export type DirEntery = {
	name: string;
	path: PathLike | string;
	children: FileEntry[];
};

export type FileErrorTypes = 'EACCES' | 'ENOENT' | 'UNKNOWN';

export type FileEntrySuccess = DirEntery | FileEntry;
export type FileEntryError = {
	error: true;
	errorCode: FileErrorTypes;
	msg?: unknown;
};

export type GetDataResult = FileEntrySuccess | FileEntryError;

export type BreadcrumbsItemsProps = {
	name: string;
	path: string;
	type?: 'file' | 'dir';
}[];

export type FilePermissions = ['read'?, 'write'?, 'execute'?] | 'EACCES';
