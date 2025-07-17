'use server';

import { copyFile, moveFile, deleteFile } from '@/lib/io';

export const copy = copyFile;
export const move = moveFile;
export const remove = deleteFile;
