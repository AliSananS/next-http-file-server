'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { addToast } from '@heroui/toast';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { FileErrorMap } from '@/types/fileErrors';
import { FileErrorTypes } from '@/types';

export default function UploadModal({
  isOpen,
  onOpenChange,
  onClose,
  props,
  multiple = false,
  filePath,
}: {
  isOpen: boolean;
  onOpenChange?: VoidFunction;
  onClose?: VoidFunction;
  props?: any;
  multiple?: boolean;
  filePath: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
  });

  const handleUpload = async () => {
    if (!files.length) return;

    setIsUploading(true);

    const formData = new FormData();

    files.forEach(file => formData.append('files', file));
    formData.append('path', filePath);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);

        setUploadProgress(percentCompleted);
      }
    };

    xhr.onerror = () => {
      setUploadStatus('An error occurred during upload.');
    };

    xhr.open('POST', '/api/upload'); // Replace with your actual upload endpoint
    xhr.send(formData);

    const res = xhr.response();

    if (res.ok) {
      addToast({ title: 'Upload complete 🎉' });
      setFiles([]);
      onClose?.();
      router.refresh();
      setIsUploading(false);

      return;
    }

    if (xhr.responseType === 'json') {
      const data = xhr.response;

      const error = data.error as FileErrorTypes;

      addToast({
        title: 'Upload failed',
        color: 'danger',
        description:
          FileErrorMap[error].message || FileErrorMap.UNKNOWN.message,
      });
      setIsUploading(false);
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      {...props}
    >
      <ModalContent className="rounded-xl shadow-2xl">
        <ModalHeader className="text-xl font-semibold">
          Upload Files
        </ModalHeader>

        <ModalBody>
          <div
            {...getRootProps()}
            className={clsx(
              'relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-default-400 transition-all duration-200',
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'hover:bg-content2/50',
            )}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-default-500">
              {isDragActive
                ? 'Drop your files here 👇'
                : 'Drag & drop files or click to browse'}
            </p>
          </div>

          {files.length > 0 && (
            <ul className="mt-4 max-h-32 overflow-y-auto text-sm text-default-700 dark:text-default-300">
              {files.map(file => (
                <li key={file.name} className="truncate">
                  📄 {file.name}
                </li>
              ))}
            </ul>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            className="text-default-500"
            variant="light"
            onPress={() => {
              setFiles([]);
              onClose?.();
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
            isLoading={isUploading}
            onPress={handleUpload}
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
