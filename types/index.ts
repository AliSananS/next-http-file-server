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
  path: string;
  permissions: FilePermissions;
  size?: number;
  time?: Date;
};

export type DirEntery = {
  name: string;
  path: string;
  children: FileEntry[];
};

export type FileErrorTypes = 'EACCES' | 'ENOENT' | 'UNKNOWN';

export type FileEntrySuccess = DirEntery | FileEntry;

export type FileEntryError = {
  errorCode: FileErrorTypes;
  msg?: unknown;
};

export type GetDataResult =
  | ({ kind: 'error' } & FileEntryError)
  | ({ kind: 'dir' } & DirEntery)
  | ({ kind: 'file' } & FileEntry);

export type FilePermissions =
  | ['read'?, 'write'?, 'execute'?]
  | 'EACCES'
  | 'ENOENT';

export type downloadFileSuccess = {
  error: false;
  content: any;
  contentType: string;
  contentLength: number;
};

export type downloadFileError = {
  error: true;
  code: FileErrorTypes;
  msg: string;
};

export type downloadFileResult = downloadFileSuccess | downloadFileError;

export type BreadcrumbsItemsProps = {
  name: string;
  path: string;
  type?: 'file' | 'dir';
}[];

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export type CopyFileError =
  | 'MISSING_PATH'
  | 'SOURCE_NOT_FOUND'
  | 'DEST_DIR_NOT_FOUND'
  | 'NO_READ_PERMISSION'
  | 'NO_WRITE_PERMISSION'
  | 'COPY_FAILED';
