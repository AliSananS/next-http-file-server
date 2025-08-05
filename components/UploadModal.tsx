'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { CircularProgress } from '@heroui/progress';
import { Spinner } from '@heroui/spinner';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { useDropzoneContext } from '@/hooks/DropzoneContext';
import {
  BackspaceIcon,
  CheckmarkIcon,
  CloseCircleIcon,
  ErrorIcon,
  FileIcon,
  FolderOpenIcon,
  RestartIcon,
  UploadCloudIcon,
  UploadIcon,
} from '@/components/icons';
import { FileEntry, FileErrorTypes, FileTypes, UploadFileEntry } from '@/types';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/lib/helpers';
import FileIconMap from '@/components/FileIconMap';
import { FileErrorMap } from '@/types/fileErrors';
import { log } from '@/lib/log';
import { ModalClassNames } from '@/components/classNames';

type Props = {
  multiple?: boolean;
  onClose: () => void;
  isOpen: boolean;
  filePath: string;
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
    setAcceptedFiles,
  } = useDropzoneContext();

  const [files, setFiles] = useState<UploadFileEntry[]>([]);
  const [uploadingFileId, setUploadingFileId] = useState(
    files.find(f => f.isUploading)?.id || null,
  );
  const router = useRouter();

  const { upload, isUploading, progress, abort } = useFileUpload();

  useEffect(() => {
    const newFiles: UploadFileEntry[] = acceptedFiles
      .filter(f => !files.find(existing => existing.name === f.name))
      .map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        file,
        name: file.name,
        size: file.size,
        type: (file.type?.split('/')[0] as FileTypes) || 'file',
        status: 'pending',
        isUploading: false,
        progress: 0,
        path: filePath || './',
      }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [acceptedFiles]);

  useEffect(() => {
    setFiles(prev =>
      prev.map(file =>
        file.id === uploadingFileId ? { ...file, isUploading } : file,
      ),
    );
  }, [isUploading, uploadingFileId]);

  useEffect(() => {
    setFiles(prev =>
      prev.map(file =>
        file.id === uploadingFileId ? { ...file, progress } : file,
      ),
    );
  }, [progress, uploadingFileId]);

  const handleUploads = async (exactFiles: UploadFileEntry[] | undefined) => {
    if (!files || files.length === 0) return;

    // Helper to upload a single file and return a promise
    const uploadFile = (fileEntry: UploadFileEntry): Promise<void> => {
      return new Promise(resolve => {
        setUploadingFileId(fileEntry.id);
        setFiles(prev =>
          prev.map(file =>
            file.id === fileEntry.id
              ? { ...file, status: 'uploading', isUploading: true, progress: 0 }
              : file,
          ),
        );
        upload(fileEntry.file, '/upload', filePath, (err, res) => {
          if (err) {
            setFiles(prev =>
              prev.map(file =>
                file.id === fileEntry.id
                  ? {
                      ...file,
                      status: 'error',
                      error: err || 'UNKNOWN',
                    }
                  : file,
              ),
            );
            const errorMessage: FileErrorTypes | string = err;

            addToast({
              title: 'Error uploading file',
              description:
                FileErrorMap[err as FileErrorTypes]?.message || errorMessage,
              color: errorMessage === 'EEXIST' ? 'warning' : 'danger',
              icon: <UploadIcon />,
            });
          } else {
            setFiles(prev =>
              prev.map(file =>
                file.id === fileEntry.id
                  ? { ...file, status: 'completed', isUploading: false }
                  : file,
              ),
            );
            setAcceptedFiles(prev =>
              prev.filter(f => f.name !== fileEntry.file.name),
            );
            router.refresh();
            addToast({
              title: 'File uploaded successfully',
              description: `File ${fileEntry.file.name} uploaded successfully.`,
              color: 'success',
              icon: <UploadIcon />,
            });
            setAcceptedFiles(prev =>
              prev.filter(f => f.name !== fileEntry.file.name),
            );
          }
          resolve();
        });
      });
    };

    if (exactFiles && exactFiles.length > 0) {
      // If a file is provided, only upload that file
      for (const fileEntry of exactFiles) {
        await uploadFile(fileEntry);
      }
    } else {
      // Otherwise, upload all pending files sequentially
      for (const fileEntry of files.filter(f => f.status === 'pending')) {
        await uploadFile(fileEntry);
      }
    }
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{ ...ModalClassNames }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <Header />
        <ModalBody>
          <div className="flex sm:flex-col">
            <UploadButton
              inputProps={getInputProps}
              inputRef={inputRef}
              isDragActive={isDragActive}
              rootProps={getRootProps}
            />
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FilesList
                    files={files}
                    setFiles={setFiles}
                    startUploads={file => file && handleUploads(file)}
                    onAbort={id => abort()}
                    onClear={() => {
                      setFiles([]);
                      setAcceptedFiles([]);
                    }}
                    onRemove={id => {
                      setAcceptedFiles(prev =>
                        prev.filter(
                          file =>
                            file.name !==
                            files.find(f => f.id === id)?.file.name,
                        ),
                      );
                      setFiles(prev => prev.filter(file => file.id !== id));
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            spinner={<Spinner variant="dots" />}
            onPress={() => handleUploads(undefined)}
          >
            Upload all
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const Header = () => <ModalHeader>Upload Files</ModalHeader>;

const UploadButton = ({
  rootProps,
  inputProps,
  isDragActive,
  inputRef,
}: {
  rootProps: Function;
  inputProps: Function;
  isDragActive?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <div {...rootProps()} className="w-full">
      <motion.div
        animate={{
          scale: isDragActive ? 1.01 : 1,
          borderColor: isDragActive
            ? 'var(--heroui-default-500)'
            : 'var(--heroui-divider)',
          backgroundColor: isDragActive
            ? 'var(--heroui-content3)'
            : 'transparent',
        }}
        className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6"
        initial={false}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {isDragActive ? (
          <>
            <FolderOpenIcon className="text-default-500" size={48} />
            <p className="text-lg font-semibold">Drop your files here</p>
          </>
        ) : (
          <>
            <UploadCloudIcon className="text-default-500" size={32} />
            <p className="text-sm font-medium text-default-500">
              Drag & drop files or click below
            </p>
            <Button
              className="border-default-500"
              startContent={<FileIcon weight="Outline" />}
              variant="bordered"
              onPress={() => {
                if (inputRef?.current) {
                  inputRef.current.click();
                }
              }}
            >
              Select files
            </Button>
          </>
        )}

        <input {...inputProps()} />
      </motion.div>
    </div>
  );
};

const FilesList = ({
  files,
  onAbort,
  onRemove,
  onClear,
  setFiles,
  startUploads,
}: {
  files: UploadFileEntry[];
  onAbort: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  setFiles: Dispatch<SetStateAction<UploadFileEntry[]>>;
  startUploads: (files: UploadFileEntry[]) => Promise<void>;
}) => {
  const statusOrder = {
    uploading: 0,
    pending: 1,
    completed: 2,
    error: 3,
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-row justify-end">
        <Button color="default" size="sm" variant="light" onPress={onClear}>
          Clear All
        </Button>
      </div>

      <ul className="flex max-h-72 flex-col overflow-y-scroll scrollbar-hide">
        <AnimatePresence initial={false}>
          {files
            .slice()
            .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
            .map(file => (
              <motion.li
                key={file.id}
                layout
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full items-center justify-between rounded-lg bg-content1 px-3 py-2 hover:bg-content1/70 dark:bg-content1/50 hover:dark:bg-content1/70"
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* LEFT: Icon + Status + Name */}
                <div className="flex min-w-0 items-center gap-3">
                  {/* Animated Status Icon */}
                  <AnimatePresence initial={false} mode="wait">
                    {file.status === 'completed' && !file.isUploading && (
                      <motion.span
                        key="completed"
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        initial={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckmarkIcon className="text-success" />
                      </motion.span>
                    )}

                    {file.status === 'error' && !file.isUploading && (
                      <motion.span
                        key="error"
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        initial={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ErrorIcon className="text-danger" />
                      </motion.span>
                    )}

                    {file.isUploading && (
                      <motion.span
                        key="uploading"
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        initial={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CircularProgress
                          color={file.progress === 100 ? 'success' : 'primary'}
                          showValueLabel={true}
                          size="md"
                          value={
                            file.progress === 100 ? undefined : file.progress
                          }
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* File Icon + Info */}
                  {FileIconMap(file.type || 'file')}
                  <div className="flex min-w-0 flex-col">
                    <span
                      className={`truncate text-sm ${
                        file.status === 'error'
                          ? 'text-danger'
                          : 'text-default-foreground'
                      }`}
                    >
                      {file.name}
                    </span>
                    <span className="text-xs text-default-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>

                {/* RIGHT: Action Buttons */}
                <div className="flex flex-shrink-0 items-center gap-1">
                  {file.isUploading && (
                    <Button
                      isIconOnly
                      startContent={
                        <CloseCircleIcon
                          className="text-default-500"
                          size={24}
                        />
                      }
                      variant="light"
                      onPress={() => onAbort(file.id)}
                    />
                  )}

                  {file.status === 'pending' && !file.isUploading && (
                    <Button
                      isIconOnly
                      startContent={
                        <UploadIcon className="text-default-500" size={24} />
                      }
                      variant="light"
                      onPress={() => startUploads([file])}
                    />
                  )}

                  {!file.isUploading && (
                    <Button
                      isIconOnly
                      size="sm"
                      startContent={
                        <BackspaceIcon className="text-default-500" size={24} />
                      }
                      variant="light"
                      onPress={() => onRemove(file.id)}
                    />
                  )}

                  {file.status === 'error' && !file.isUploading && (
                    <Button
                      isIconOnly
                      startContent={
                        <RestartIcon className="text-default-500" size={24} />
                      }
                      variant="light"
                      onPress={() => {
                        setFiles(prev =>
                          prev.map(f =>
                            f.id === file.id ? { ...f, status: 'pending' } : f,
                          ),
                        );
                        startUploads([file]);
                      }}
                    />
                  )}
                </div>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};
