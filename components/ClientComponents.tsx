'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { addToast } from '@heroui/toast';
import clsx from 'clsx';

import { useClipboard } from '@/hooks/ClipboardContext';
import {
  PasteIcon,
  AddFolderIcon,
  FolderErrorIcon,
  FolderIcon,
  UploadCloudIcon,
} from '@/components/icons';
import { copyFileAction, createFolderAction } from '@/app/actions';
import { FileErrorMap } from '@/types/fileErrors';
import { getRandomFolderPlaceholder } from '@/lib/helpers';
import UploadModal from '@/components/UploadModal';
import { useDropzoneContext } from '@/hooks/DropzoneContext';
import { modal as modalStyles } from '@/components/sharedStyles';

function ensureRelative(path: string): string {
  return path.replace(/^\/+/, '');
}

export function ActionButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const { item, clear } = useClipboard();
  const [isPasting, startTransition] = useTransition();
  const { isUploadModalOpen, setIsUploadModalOpen } = useDropzoneContext();

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] =
    useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0); // Can't use window.innerHeight here

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', () => setWidth(window.innerWidth));

    return () => window.removeEventListener('resize', () => {});
  }, []);

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
    const dirPath = ensureRelative(pathname + '/' + folderName.trim());
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
          endContent={<AddFolderIcon size={16} weight="Outline" />}
          htmlFor="uploadInput"
          isIconOnly={width < 640}
          size="sm"
          variant="light"
          onPress={() => setIsCreateFolderModalOpen(true)}
        >
          {width >= 640 && 'New folder'}
        </Button>
        <Button
          color="primary"
          endContent={<UploadCloudIcon size={16} />}
          isIconOnly={width <= 640}
          size="sm"
          onPress={() => setIsUploadModalOpen(true)}
        >
          {width >= 640 && 'Upload'}
        </Button>
      </div>

      {/* Create Folder Modal */}
      <Modal
        hideCloseButton
        backdrop="blur"
        classNames={{ base: clsx(modalStyles?.base) }}
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
