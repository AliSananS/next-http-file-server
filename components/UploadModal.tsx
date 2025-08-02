'use client';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import React, { useState } from 'react';

import { useDropzoneContext } from '@/hooks/DropzoneContext';
import { UploadCloudIcon } from '@/components/icons';
import { FileTypes } from '@/types';
import { useFileUpload } from '@/hooks/useFileUpload';

type Props = {
  multiple?: boolean;
  onClose: () => void;
  isOpen: boolean;
  filePath?: string;
};

type UploadFileEntry = {
  file: File;
  isUploading: boolean;
  error: boolean;
  errorMessage?: string;
  progress: number;
  size: number;
  name: string;
  type?: FileTypes;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  id: string;
};

export default function UploadModal({
  multiple,
  onClose,
  isOpen,
  filePath,
}: Props) {
  const {
    acceptedFiles,
    open,
    getInputProps,
    getRootProps,
    isDragActive,
    inputRef,
    rejectedFiles,
    isFileDialogActive,
  } = useDropzoneContext();

  const { upload, isUploading, progress, abort } = useFileUpload();

  const handleUpload = async () => {};

  return (
    <Modal
      classNames={{ base: 'bg-white dark:bg-black border-1 border-divider' }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <Header />
        <ModalBody>
          <div className="flex sm:flex-col">
            <UploadButton inputProps={getInputProps} rootProps={getRootProps} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const Header = () => <ModalHeader>Upload Files</ModalHeader>;

const UploadButton = ({
  rootProps,
  inputProps,
}: {
  rootProps: Function;
  inputProps: Function;
}) => {
  return (
    <div
      className="flex h-32 w-full border-spacing-2 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-divider bg-content1/50 transition-colors duration-300 hover:bg-content1/75"
      {...rootProps()}
    >
      <span className="flex h-full w-full flex-col items-center justify-center transition-transform duration-300 hover:scale-105">
        <UploadCloudIcon size={48} weight="LineDuotone" />
        <p className="text-sm font-light text-default-600">
          Drag and drop files here
        </p>
        <p className="text-sm font-bold text-default-700 underline underline-offset-2 hover:text-foreground">
          or browse
        </p>
      </span>
      <input {...inputProps()} />
    </div>
  );
};

const FilesList = ({ files }: { files: UploadFileEntry[] }) => {
  return <ul />;
};
