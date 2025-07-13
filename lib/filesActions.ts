'use client';

import { moveFileAction } from '@/app/nhfs_actions/route';
import { FileEntry } from '@/types';

export async function copyFile(
  file: FileEntry,
  destination: string,
  { move }: { move: boolean },
) {
  await moveFileAction(file.path, destination);
}
