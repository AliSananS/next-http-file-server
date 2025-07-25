'use server';

import { copyFile, deleteFile, createFolder } from '@/lib/io';

export const copyFileAction = copyFile;
export const deleteFileAction = deleteFile;
export const createFolderAction = createFolder;
