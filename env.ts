import path from 'node:path';

export const BASE_DIR = path.resolve(
  (process.env.NODE_ENV === 'development' && process.env.BASE_DIR) ||
    process.env.NHFS_BASE_DIR ||
    process.cwd(),
);

export const ALLOW_DELETE = process.env.NHFS_ALLOW_DELETE || false;
export const ALLOW_COPY = process.env.NHFS_ALLOW_COPY || false;
export const ALLOW_UPLOAD = process.env.NHFS_ALLOW_UPLOAD || false;
