'use client';
import path from 'path';

import Link from 'next/link';
import {
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Dropdown,
} from '@heroui/dropdown';
import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';
import { Input } from '@heroui/input';
import { useState, useTransition } from 'react';
import { Kbd } from '@heroui/kbd';
import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';

import {
  CopyIcon,
  CutIcon,
  DeleteIcon,
  DownloadIcon,
  InfoIcon,
  MenuDotsIcon,
  RenameIcon,
} from '@/components/icons';
import { DirEntery, FileEntry } from '@/types';
import IconMap from '@/components/FileIconMap';
import { useClipboard } from '@/hooks/ClipboardContext';
import { copyFileAction, deleteFileAction } from '@/app/actions';
import { FileErrorMap } from '@/types/fileErrors';
import { FileInfoModal } from '@/components/FileInfoModal';
import { ModalClassNames } from '@/components/classNames';

export default function FilesList({ files }: { files: DirEntery }) {
  return (
    <div className="flex flex-col gap-2">
      {files.children.map(file => (
        <div
          key={file.path.toString()}
          className="flex h-8 w-full flex-row justify-between overflow-hidden rounded-md bg-content2/75 pl-4 hover:bg-content2 dark:bg-content1/75 hover:dark:bg-content1"
        >
          <LeftWrapper
            href={path.join('/', file.path.toString())}
            icon={IconMap(file.type)}
            title={file.name}
          />
          <RightWrapper file={file} />
        </div>
      ))}
    </div>
  );
}

const LeftWrapper = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: JSX.Element;
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {icon}
      <Link
        className="overflow-clip text-nowrap text-sm font-light hover:underline"
        href={href}
      >
        {title}
      </Link>
    </div>
  );
};

const RightWrapper = ({ file }: { file: DirEntery['children'][number] }) => {
  const { copy } = useClipboard();
  const router = useRouter();
  const [newFilename, setNewFilename] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isRenaming, startRenameTransaction] = useTransition();
  const [isDeleting, startDeleteTransaction] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFileInfoModalOpen, setIsFileInfoModalOpen] = useState(false);

  const copyHandler = (
    file: DirEntery | FileEntry,
    { move }: { move: boolean } = { move: false },
  ) => {
    copy({
      path: file.path,
      name: file.name,
      mode: move ? 'move' : 'copy',
    });
    addToast({
      title: move ? 'Cut' : 'Copied',
      color: 'default',
      icon: move ? <CutIcon size={20} /> : <CopyIcon size={20} />,
    });
  };

  const deleteHandler = async (file: DirEntery | FileEntry) => {
    startDeleteTransaction(async () => {
      const result = await deleteFileAction(file.path);

      if (result.ok) {
        addToast({
          title: 'Deleted',
          color: 'default',
          icon: <DeleteIcon />,
        });
        router.refresh();
        setIsDeleteModalOpen(false);
      } else {
        addToast({
          title: 'Error deleting file',
          color: 'danger',
          description:
            FileErrorMap[result.error]?.message || FileErrorMap.UNKNOWN.message,
          icon: <DeleteIcon />,
        });
      }
    });
  };

  async function renameHandler(file: FileEntry) {
    const originalName = file.name;
    const filePath = file.path;
    const dirname = file.parentPath;

    if (originalName === newFilename || newFilename === '') {
      setIsRenameModalOpen(false);

      return;
    }
    startRenameTransaction(async () => {
      const result = await copyFileAction(
        filePath,
        `${dirname}/${newFilename}`,
        { move: true },
      );

      if (!result.ok) {
        addToast({
          title: 'Error renaming file',
          color: 'danger',
          description: FileErrorMap[result.error]?.message,
          icon: <RenameIcon size={20} />,
        });
      } else {
        router.refresh();
        setIsRenameModalOpen(false);
      }
    });
  }

  return (
    <div className="flex flex-row items-center">
      <Dropdown backdrop="blur">
        <DropdownTrigger className="active:border-none">
          <div className="flex h-full w-8 items-center justify-center from-content1 to-content2 hover:cursor-pointer hover:bg-gradient-to-r">
            <MenuDotsIcon
              className="rotate-90 text-default-500 focus:outline-none"
              focusable={false}
              weight="Bold"
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownSection>
            {file.type !== 'dir' ? (
              <DropdownItem
                key="download"
                className="hover:bg-primary-50"
                // description={`Download ${fileType}`}
                startContent={<DownloadIcon />}
                onPress={() => {
                  window.location.href = file.path + '?dl=true';
                }}
              >
                Download
              </DropdownItem>
            ) : (
              <></>
            )}

            <DropdownItem
              key="copy"
              className="select-none"
              // description={`Copy ${fileType} to`}
              closeOnSelect={false}
              startContent={
                <div className="h-4 w-4">
                  <CopyIcon />
                </div>
              }
              onPress={() => {
                copyHandler(file);
              }}
            >
              Copy
            </DropdownItem>

            <DropdownItem
              key="move"
              className="select-none"
              closeOnSelect={false}
              // description={`Move ${fileType} to`}
              startContent={
                <div className="h-4 w-4">
                  <CutIcon />
                </div>
              }
              onPress={() => {
                copyHandler(file, { move: true });
              }}
            >
              Move
            </DropdownItem>
            <DropdownItem
              key="rename"
              className="select-none"
              startContent={
                <div className="h-4 w-4">
                  <RenameIcon />
                </div>
              }
              onPress={() => setIsRenameModalOpen(true)}
            >
              Rename
            </DropdownItem>
          </DropdownSection>
          <DropdownSection showDivider title="Danger Zone">
            <DropdownItem
              key="delete"
              className="text-danger-500"
              color="danger"
              startContent={<DeleteIcon />}
              variant="solid"
              onPress={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="info"
              // description="File information"
              startContent={<InfoIcon />}
              onPress={() => setIsFileInfoModalOpen(true)}
            >
              Info
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <FileInfoModal
        file={file}
        isOpen={isFileInfoModalOpen}
        onClose={() => setIsFileInfoModalOpen(false)}
      />
      <Modal
        hideCloseButton
        backdrop="blur"
        classNames={{ ...ModalClassNames }}
        isOpen={isDeleteModalOpen}
        motionProps={{
          variants: {
            enter: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
          },
          transition: { duration: 0.2 },
        }}
      >
        <ModalContent className="rounded-xl border border-divider shadow-xl">
          <ModalHeader className="flex flex-col gap-1">
            Delete File
            <span className="text-sm font-normal text-default-500">
              This action is irreversible. You sure about this?
            </span>
          </ModalHeader>

          <ModalBody>
            <div className="flex items-center gap-3 p-1">
              <span className="text-lg">🗑️</span>
              <span className="text-base">
                <strong>{file.name}</strong> will be permanently deleted.
              </span>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              className="text-default-500"
              variant="light"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              endContent={
                <Kbd
                  classNames={{
                    base: 'bg-transparent border-none shadow-none p-0 m-0',
                  }}
                  keys={['enter']}
                />
              }
              isLoading={isDeleting}
              onPress={() => deleteHandler(file)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        hideCloseButton
        backdrop="blur"
        classNames={{ ...ModalClassNames }}
        isOpen={isRenameModalOpen}
        motionProps={{
          variants: {
            enter: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
          },
          transition: { duration: 0.2 },
        }}
      >
        <ModalContent className="rounded-xl shadow-xl">
          <ModalHeader className="flex flex-col gap-1">
            Rename File
            <span className="text-sm font-normal text-default-500">
              Give your file a new identity 👀
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
              defaultValue={file.name}
              placeholder="Enter new name"
              radius="lg"
              size="lg"
              startContent={
                <span className="text-sm text-default-400">📄</span>
              }
              variant="bordered"
              onValueChange={text => setNewFilename(text)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              className="text-default-500"
              variant="light"
              onPress={() => setIsRenameModalOpen(false)}
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
              isLoading={isRenaming}
              onPress={() => {
                renameHandler(file);
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
