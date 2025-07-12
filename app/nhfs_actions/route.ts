import { copyFile, deleteFile, moveFile } from '@/lib/io';

export async function deleteFileAction(
	filePath: string,
	{ force = false, recursive = false }: { force: boolean; recursive: boolean },
): Promise<boolean> {
	return await deleteFile(filePath, { force, recursive });
}

export async function moveFileAction(
	filePath: string,
	destination: string,
	{ force = false }: { force: boolean },
): Promise<boolean> {
	return moveFile(filePath, destination, { force });
}

export async function copyFileAction(
	source: string,
	destination: string,
): Promise<boolean> {
	return await copyFile(source, destination);
}
