'use client';
import path from 'path';

import Link from 'next/link';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/dropdown';
import { addToast } from '@heroui/toast';

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
import IconMap from '@/components/fileExtensionToIconMap';
import { useClipboard } from '@/hooks/ClipboardContext';

export default function FilesList({ files }: { files: DirEntery }) {
  return (
    <div className="flex flex-col gap-2">
      {files.children.map(file => (
        <div
          key={file.path.toString()}
          className="flex h-8 w-full flex-row justify-between overflow-hidden rounded-md bg-content2/75 pl-4 hover:bg-content2 dark:bg-content1/75 hover:dark:bg-content1"
        >
          <LeftWrapper
            icon={IconMap(file.type)}
            path={path.join('/', file.path.toString())}
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
  path,
  icon,
}: {
  title: string;
  path: string;
  icon: JSX.Element;
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {icon}
      <Link
        className="overflow-clip text-nowrap text-sm font-light hover:underline"
        href={path}
      >
        {title}
      </Link>
    </div>
  );
};

const RightWrapper = ({ file }: { file: DirEntery['children'][number] }) => {
  const fileType = file.type === 'dir' ? 'folder' : 'file';
  const { copy } = useClipboard();

  const copyHandler = (
    file: DirEntery | FileEntry,
    { move }: { move: boolean } = { move: false },
  ) => {
    copy({
      path: file.path,
      name: file.name,
      mode: 'copy',
    });
    addToast({
      title: move ? 'Cut' : 'Copied',
      color: 'default',
      icon: move ? <CutIcon size={24} /> : <CopyIcon size={20} />,
    });
  };

  return (
    <div className="flex flex-row items-center">
      <div className="flex h-full w-8 items-center justify-center from-content1 to-content2 hover:cursor-pointer hover:bg-gradient-to-r">
        <Dropdown backdrop="blur">
          <DropdownTrigger className="active:border-none">
            {/* @ts-ignore //Ignore className error. */}
            <MenuDotsIcon
              className="rotate-90 text-default-500 focus:outline-none"
              focusable={false}
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSection>
              {file.type !== 'dir' ? (
                <DropdownItem
                  key="download"
                  className="hover:bg-primary-50"
                  // description={`Download ${fileType}`}
                  startContent={<DownloadIcon weight="BoldDuotone" />}
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
                startContent={
                  <div className="h-4 w-4">
                    <CopyIcon />
                  </div>
                }
                onPress={() => copyHandler(file)}
              >
                Copy
              </DropdownItem>

              <DropdownItem
                key="move"
                className="select-none"
                // description={`Move ${fileType} to`}
                startContent={
                  <div className="h-4 w-4">
                    <CutIcon />
                  </div>
                }
                onPress={() => copyHandler(file, { move: true })}
              >
                Move
              </DropdownItem>

              <DropdownItem
                key="rename"
                className="select-none"
                // description={`Rename ${fileType}`}
                startContent={
                  <div className="h-4 w-4">
                    <RenameIcon />
                  </div>
                }
                onPress={() => {
                  // moveFileAction(file.path);
                }}
              >
                Rename :TODO
              </DropdownItem>
            </DropdownSection>
            <DropdownSection showDivider title="Danger Zone">
              <DropdownItem
                key="delete"
                className="text-danger-500"
                classNames={{
                  description: 'text-danger-500',
                }}
                color="danger"
                description={`Permanently delete ${fileType}`}
                startContent={<DeleteIcon />}
                variant="solid"
                onPress={() => {}}
              >
                Delete
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem
                key="info"
                // description="File information"
                startContent={<InfoIcon />}
              >
                Info
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};
