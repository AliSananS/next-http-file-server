import type { FileErrorTypes, CopyFileErrorTypes } from '@/types';

type ErrorTypes = FileErrorTypes | CopyFileErrorTypes;

type FileErrorEntry = {
  code: ErrorTypes;
  message: string;
};

export const FileErrorMap: Record<ErrorTypes, FileErrorEntry> = {
  EACCES: {
    code: 'EACCES',
    message: "Nice try. You don't have permission to touch that file.",
  },
  EPERM: {
    code: 'EPERM',
    message: "Permission denied. You're not that guy, pal.",
  },
  ENOENT: {
    code: 'ENOENT',
    message: "It's gone. Like your motivation after 3am.",
  },
  EEXIST: {
    code: 'EEXIST',
    message: 'Already exists. Stop trying to clone stuff like an intern.',
  },
  EPATHINJECTION: {
    code: 'EPATHINJECTION',
    message: 'Trying to sneak into root? Not on my watch, Hackerman.',
  },
  EIO: {
    code: 'EIO',
    message: "Disk said no. Maybe it's tired too.",
  },
  EINVAL: {
    code: 'EINVAL',
    message: "That path is so wrong even a GPS can't help.",
  },
  EXDEV: {
    code: 'EXDEV',
    message: "Can't move across devices. We don’t teleport files yet.",
  },
  ENOTDIR: {
    code: 'ENOTDIR',
    message: "You thought that was a folder? It ain't. ",
  },
  EISDIR: {
    code: 'EISDIR',
    message: 'You tried to handle a folder like a file. Bad touch.',
  },
  EBUSY: {
    code: 'EBUSY',
    message: 'Chill, that file is busy doing file things.',
  },
  EFBIG: {
    code: 'EFBIG',
    message: "File too thicc. Can't handle all that data.",
  },
  UNKNOWN: {
    code: 'UNKNOWN',
    message: 'Something went wrong but we’re too lazy to tell you what.',
  },
  MISSING_PATH: {
    code: 'MISSING_PATH',
    message: "You forgot to tell me where. Paths aren't optional.",
  },
  SOURCE_NOT_FOUND: {
    code: 'SOURCE_NOT_FOUND',
    message: 'Source file vanished. Did you imagine it?',
  },
  DEST_DIR_NOT_FOUND: {
    code: 'DEST_DIR_NOT_FOUND',
    message: "Destination folder missing. Can't deliver to nowhere.",
  },
  NO_READ_PERMISSION: {
    code: 'NO_READ_PERMISSION',
    message: "Can't peek inside. Reading is off-limits.",
  },
  NO_WRITE_PERMISSION: {
    code: 'NO_WRITE_PERMISSION',
    message: "Can't write here. Pen's out of ink, metaphorically.",
  },
  COPY_FAILED: {
    code: 'COPY_FAILED',
    message: "Copy operation failed. The clone didn't survive.",
  },
  DEST_ALREADY_EXISTS: {
    code: 'DEST_ALREADY_EXISTS',
    message: 'Destination already exists. Stop trying to overwrite reality.',
  },
};
