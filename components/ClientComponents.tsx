'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonGroup } from '@heroui/button';
import { usePathname } from 'next/navigation';
import { addToast } from '@heroui/toast';
import { useState, Suspense, useTransition } from 'react';
import { Spinner } from '@heroui/spinner';

import { useClipboard } from '@/hooks/ClipboardContext';
import {
  PasteIcon,
  AddFolderIcon,
  UploadIcon,
  FolderErrorIcon,
} from '@/components/icons';
import { copyFileAction, createFolderAction } from '@/app/actions';
import { FileErrorMap } from '@/types/fileErrors';

export function ActionButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPasting, startTransaction] = useTransition();

  const { item, clear } = useClipboard();

  function ensureRelative(path: string): string {
    return path.startsWith('/') ? path.slice(1) : path;
  }

  const handlePaste = async () => {
    startTransaction(async () => {
      if (item !== null) {
        const destinationPath = `${ensureRelative(pathname)}/${item.name}`;
        const result = await copyFileAction(item.path, destinationPath, {
          move: item.mode === 'move',
        });

        if (result.ok) {
          addToast({
            title: `File ${item.mode === 'copy' ? 'copied' : 'moved'} successfully`,
          });
          clear();
          router.refresh();
        } else {
          console.log('Error Code:', result.error);
          addToast({
            title:
              FileErrorMap[result.error as keyof typeof FileErrorMap]?.message,
            color: 'danger',
          });
        }
      }
    });
  };

  async function handleCreateFolder() {
    const dirName = prompt('Enter the name');
    const dirPath = `${ensureRelative(pathname)}/${dirName}`;

    const result = await createFolderAction(dirPath);

    if (!result.ok) {
      addToast({
        title: 'Error creating folder',
        description:
          FileErrorMap[result.error]?.message || FileErrorMap.UNKNOWN.message,
        color: 'danger',
        icon: <FolderErrorIcon />,
      });
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex gap-2">
      {item !== null && (
        <Button
          className="mr-2"
          color="default"
          isLoading={isPasting}
          size="sm"
          startContent={<PasteIcon size={16} />}
          onPress={handlePaste}
        >
          Paste
        </Button>
      )}
      <Button
        color="default"
        endContent={<AddFolderIcon size={16} />}
        size="sm"
        variant="light"
        onPress={handleCreateFolder}
      >
        New folder
      </Button>
      <Button color="primary" endContent={<UploadIcon size={16} />} size="sm">
        Upload
      </Button>
    </div>
  );
}
