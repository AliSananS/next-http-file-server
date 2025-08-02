'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Kbd } from '@heroui/kbd';
import { addToast } from '@heroui/toast';

import { useClipboard } from '@/hooks/ClipboardContext';
import {
  PasteIcon,
  AddFolderIcon,
  UploadIcon,
  FolderErrorIcon,
  FolderIcon,
} from '@/components/icons';
import { copyFileAction, createFolderAction } from '@/app/actions';
import { FileErrorMap } from '@/types/fileErrors';
import { getRandomFolderPlaceholder } from '@/lib/helpers';
import UploadModal from '@/components/UploadModal';

function ensureRelative(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path;
}

export function ActionButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const { item, clear } = useClipboard();
  const [isPasting, startTransition] = useTransition();

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handlePaste = async () => {
    startTransition(async () => {
      if (item) {
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
          addToast({
            title: FileErrorMap[result.error]?.message,
            color: 'danger',
          });
        }
      }
    });
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    setIsCreatingFolder(true);
    const dirPath = `${ensureRelative(pathname)}/${folderName.trim()}`;
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
      setIsCreateFolderModalOpen(false);
      setFolderName('');
    }

    setIsCreatingFolder(false);
  };

  return (
    <>
      <div className="flex gap-2">
        {item && (
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
          as="label"
          color="default"
          endContent={<AddFolderIcon size={16} />}
          htmlFor="uploadInput"
          size="sm"
          variant="light"
          onPress={() => setIsCreateFolderModalOpen(true)}
        >
          New folder
        </Button>
        <Button
          color="primary"
          endContent={<UploadIcon size={16} />}
          size="sm"
          onPress={() => setIsUploadModalOpen(true)}
        >
          Upload
        </Button>
      </div>

      {/* Create Folder Modal */}
      <Modal
        hideCloseButton
        backdrop="blur"
        isOpen={isCreateFolderModalOpen}
        motionProps={{
          variants: {
            enter: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
          },
          transition: { duration: 0.2 },
        }}
        onOpenChange={() => setIsCreateFolderModalOpen(false)}
      >
        <ModalContent className="rounded-xl shadow-xl">
          <ModalHeader className="flex flex-col gap-1">
            Create Folder
            <span className="text-sm font-normal text-default-500">
              What do we name it?
            </span>
          </ModalHeader>

          <ModalBody>
            <Input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              classNames={{
                inputWrapper: 'border-default-200 hover:border-primary',
                input: 'text-base font-medium',
              }}
              placeholder={getRandomFolderPlaceholder()}
              radius="lg"
              size="lg"
              startContent={<FolderIcon />}
              value={folderName}
              variant="bordered"
              onValueChange={setFolderName}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              className="text-default-500"
              variant="light"
              onPress={() => {
                setIsCreateFolderModalOpen(false);
                setFolderName('');
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              endContent={
                <Kbd
                  classNames={{
                    base: 'bg-transparent border-none shadow-none p-0 m-0',
                  }}
                  keys={['enter']}
                />
              }
              isLoading={isCreatingFolder}
              onPress={handleCreateFolder}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <UploadModal
        multiple
        filePath={ensureRelative(pathname)}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}
