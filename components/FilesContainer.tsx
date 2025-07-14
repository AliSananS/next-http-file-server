import path from 'node:path';

import { Button } from '@heroui/button';
import React from 'react';
import { Divider } from '@heroui/divider';
import Link from 'next/link';

import {
  AddFolderIcon,
  ErrorIcon,
  PasteIcon,
  UploadIcon,
} from '@/components/icons';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FileEntry, FileEntryError, GetDataResult } from '@/types';
import FilesList from '@/components/FilesList';
import { FileErrorMap } from '@/components/FileErrorMap';
import createBreadcrumbsData from '@/lib/createBreadcrumbsData';
import fileTypeMap from '@/lib/fileTypeMap';
import ImageView from '@/components/ImageView';
import VideoPlayer from '@/components/VideoPlayer';
import { useClipboard } from '@/components/ClipboardContext';

export default async function FilesContainer({
  filesData,
}: {
  filesData: GetDataResult;
}) {
  const breadCrumbsData = createBreadcrumbsData(filesData);

  return (
    <div className="mb-8 flex h-full min-h-96 w-full flex-col gap-4 rounded-2xl border-1 border-divider p-4">
      <HeaderSection breadCrumbsData={breadCrumbsData} />
      <Divider />
      <MainContent filesData={filesData} />
    </div>
  );
}

function HeaderSection({ breadCrumbsData }: { breadCrumbsData: any }) {
  return (
    <div className="flex w-full items-center justify-between">
      <Breadcrumbs items={breadCrumbsData} />
      <ActionButtons />
    </div>
  );
}

function ActionButtons() {
  const { item } = useClipboard();

  return (
    <div className="flex gap-2">
      {item !== null && (
        <Button
          className="mr-2"
          color="default"
          size="sm"
          startContent={<PasteIcon size={16} />}
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

async function MainContent({ filesData }: { filesData: GetDataResult }) {
  if (filesData.kind === 'error') {
    return <ErrorHandler error={filesData} />;
  }
  if (filesData.kind === 'dir') {
    return <FilesList files={filesData} />;
  }
  if (filesData.kind === 'file' && fileTypeMap.hasOwnProperty(filesData.type)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FileViewer file={filesData} />
      </div>
    );
  }

  return (
    <p>
      Unsupported file.{' '}
      <Link className="text-blue-500" href={`/${filesData.path}?dl=true`}>
        Download
      </Link>
    </p>
  );
}

function FileViewer({ file }: { file: FileEntry }) {
  const fileUrl = path.join('/nhfs_dl', file.path);

  if (file.type === 'image') {
    return <ImageView src={fileUrl} />;
  }
  if (file.type === 'video') {
    return <VideoPlayer src={fileUrl} />;
  }
}

function ErrorHandler({ error }: { error: FileEntryError }) {
  const { message, icon } = FileErrorMap[error.errorCode] || {
    message: 'Unknown error occurred',
    icon: <ErrorIcon />,
  };

  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      {icon}
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
