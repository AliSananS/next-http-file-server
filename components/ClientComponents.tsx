'use client';

import { Button } from '@heroui/button';
import { usePathname } from 'next/navigation';

import { useClipboard } from '@/hooks/ClipboardContext';
import { PasteIcon, AddFolderIcon, UploadIcon } from '@/components/icons';
import copyFileAction from '@/app/actions';
import path from 'path';

export function ActionButtons() {
  const pathname = usePathname();
  const { item } = useClipboard();
  const handlePaste = async () => {
    if (item !== null) {
      const destinationPath = `${pathname}/${item.name}`;
      await copyFileAction(item.path, destinationPath);
    }
  };

  return (
    <div className="flex gap-2">
      {item !== null && (
        <Button
          className="mr-2"
          color="default"
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
