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

export type FileErrorTypes =
  | 'EACCES'
  | 'EPERM'
  | 'ENOENT'
  | 'EEXIST'
  | 'EPATHINJECTION'
  | 'EIO'
  | 'EINVAL'
  | 'EXDEV'
  | 'ENOTDIR'
  | 'EISDIR'
  | 'EBUSY'
  | 'EFBIG'
  | 'EUNKNOWN';

export type FileOperationError = {
  ok: false;
  code: FileErrorTypes;
  msg: string;
};

export type FileEntrySuccess = DirEntery | FileEntry;

export type FileEntryError = {
  code: FileErrorTypes;
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

type FileErrorEntry = {
  code: string;
  message: string;
};

export const FileErrorMap: Record<string, FileErrorEntry> = {
  // 🔒 PERMISSIONS
  EACCES: {
    code: 'EACCES',
    message: "Nice try. You don't have permission to touch that file. 👮‍♂️",
  },
  EPERM: {
    code: 'EPERM',
    message: "Permission denied. You're not that guy, pal. 🛑",
  },

  // 🚫 FILE/FOLDER NOT FOUND
  ENOENT: {
    code: 'ENOENT',
    message: "It's gone. Like your motivation after 3am. 📂❌",
  },

  // ❌ FILE EXISTS
  EEXIST: {
    code: 'EEXIST',
    message: 'Already exists. Stop trying to clone stuff like an intern. 🧬',
  },

  // 🚫 INVALID PATH / BACKDIR
  EPATHINJECTION: {
    code: 'EPATHINJECTION',
    message: 'Trying to sneak into root? Not on my watch, Hackerman. 🕶️',
  },

  // 💽 IO ERRORS
  EIO: {
    code: 'EIO',
    message: "Disk said no. Maybe it's tired too. 💿💤",
  },

  // 📛 INVALID ARGUMENT
  EINVAL: {
    code: 'EINVAL',
    message: "That path is so wrong even a GPS can't help. 🗺️",
  },

  // 🔄 CROSS DEVICE
  EXDEV: {
    code: 'EXDEV',
    message: "Can't move across devices. We don’t teleport files yet. ✨",
  },

  // 💾 NOT A DIRECTORY
  ENOTDIR: {
    code: 'ENOTDIR',
    message: "You thought that was a folder? It ain't. 🧱",
  },

  // 📁 IS A DIRECTORY
  EISDIR: {
    code: 'EISDIR',
    message: 'You tried to handle a folder like a file. Bad touch. 🧼',
  },

  // ❌ FILE IS BUSY
  EBUSY: {
    code: 'EBUSY',
    message: 'Chill, that file is busy doing file things. ☕',
  },

  // 🚫 FILE TOO LARGE
  EFBIG: {
    code: 'EFBIG',
    message: "File too thicc. Can't handle all that data. 🍑💾",
  },

  // ❓UNKNOWN
  EUNKNOWN: {
    code: 'EUNKNOWN',
    message: 'Something went wrong but we’re too lazy to tell you what. 🫠',
  },
};
