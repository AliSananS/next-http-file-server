import { copyFile, deleteFile, moveFile } from '@/lib/io';

export async function deleteFileAction(filePath: string): Promise<boolean> {
  return await deleteFile(filePath);
}

export async function moveFileAction(
  filePath: string,
  destination: string,
): Promise<boolean> {
  return moveFile(filePath, destination);
}

export async function copyFileAction(
  source: string,
  destination: string,
): Promise<boolean> {
  return await copyFile(source, destination);
}
