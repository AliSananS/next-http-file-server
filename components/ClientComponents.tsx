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
  RestartIcon,
} from '@/components/icons';
import { copyFileAction } from '@/app/actions';
// import { copyFile } from '@/lib/io';
import { FileErrorMap } from '@/types/fileErrors';

export function ActionButtons() {
  // {
  //   reloadAction,
  //   reloading,
  // }: {
  //   reloadAction: VoidFunction;
  //   reloading: boolean;
  // }
  const router = useRouter();
  const pathname = usePathname();
  const [isPasting, startTransaction] = useTransition();

  const { item, clear } = useClipboard();
  const handlePaste = async () => {
    startTransaction(async () => {
      if (item !== null) {
        const destinationPath = `${pathname}/${item.name}`;
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
      >
        New folder
      </Button>
      <Button color="primary" endContent={<UploadIcon size={16} />} size="sm">
        Upload
      </Button>
    </div>
  );
}
