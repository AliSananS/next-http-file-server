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
import clsx from 'clsx';

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
import { modal } from '@/components/sharedStyles';

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
    files.find(f => f.status === 'uploading')?.id || null,
  );
  const router = useRouter();

  const { upload, progress, abort } = useFileUpload();

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
        progress: 0,
        path: filePath || './',
      }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [acceptedFiles]);

  useEffect(() => {
    setFiles(prev =>
      prev.map(file =>
        file.id === uploadingFileId ? { ...file, progress } : file,
      ),
    );
  }, [progress, uploadingFileId]);

  const handleUploads = async (exactFiles: UploadFileEntry[] | undefined) => {
    if (!files || files.length === 0) return;

    // Helper to upload a single file and return a promise with result
    const uploadFile = (
      fileEntry: UploadFileEntry,
    ): Promise<{ success: boolean; file: UploadFileEntry; error?: string }> => {
      return new Promise(resolve => {
        setUploadingFileId(fileEntry.id);
        setFiles(prev =>
          prev.map(file =>
            file.id === fileEntry.id
              ? { ...file, status: 'uploading', progress: 0 }
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
            resolve({ success: false, file: fileEntry, error: err });
          } else {
            setFiles(prev =>
              prev.map(file =>
                file.id === fileEntry.id
                  ? { ...file, status: 'completed' }
                  : file,
              ),
            );
            setAcceptedFiles(prev =>
              prev.filter(f => f.name !== fileEntry.file.name),
            );
            router.refresh();
            setAcceptedFiles(prev =>
              prev.filter(f => f.name !== fileEntry.file.name),
            );
            resolve({ success: true, file: fileEntry });
          }
        });
      });
    };

    let uploadTargets: UploadFileEntry[] = [];

    if (exactFiles && exactFiles.length > 0) {
      uploadTargets = exactFiles;
    } else {
      uploadTargets = files.filter(f => f.status === 'pending');
    }

    const results = [];

    for (const fileEntry of uploadTargets) {
      const result = await uploadFile(fileEntry);

      results.push(result);

      if (!result.success) {
        const errorMessage: FileErrorTypes | string = result.error ?? 'UNKNOWN';

        addToast({
          title: `Error uploading file`,
          description: `File ${fileEntry.file.name}: ${FileErrorMap[result.error as FileErrorTypes]?.message || errorMessage}`,
          color: errorMessage === 'EEXIST' ? 'warning' : 'danger',
          icon: <UploadIcon />,
        });
      }
    }

    // Only show success toast if all succeeded and more than one file
    if (results.length > 0 && results.every(r => r.success)) {
      addToast({
        title: 'All files uploaded successfully',
        description:
          results.length === 1
            ? `File ${results[0].file.file.name} uploaded successfully.`
            : `${results.length} files uploaded successfully.`,
        color: 'success',
        icon: <UploadIcon />,
      });
    }
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{ base: clsx(modal?.base) }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <Header />
        <ModalBody>
          <div>
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
        className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-divider p-6"
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

  // Check if any file is uploading
  const anyUploading = files.some(f => f.status === 'uploading');

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-row justify-end">
        {anyUploading ? (
          <Button
            color="danger"
            size="sm"
            variant="light"
            onPress={() => {
              files.forEach(f => {
                if (f.status === 'uploading') {
                  const id = f.id;

                  onAbort(f.id);
                  setFiles(prev =>
                    prev.map(file =>
                      file.id === id ? { ...file, status: 'pending' } : file,
                    ),
                  );
                }
              });
            }}
          >
            Stop All Uploads
          </Button>
        ) : (
          <Button color="default" size="sm" variant="light" onPress={onClear}>
            Clear All
          </Button>
        )}
      </div>

      <ul className="flex max-h-72 flex-col gap-2 overflow-y-scroll scrollbar-hide">
        <AnimatePresence initial={false}>
          {files.map(file => (
            <motion.li
              key={file.id}
              layout
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full items-center justify-between rounded-lg bg-content1 px-3 py-2 hover:bg-content1/70 dark:bg-content1/60 dark:hover:bg-content1/70"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* LEFT: Icon + Status + Name */}
              <div className="flex min-w-0 items-center gap-3">
                {/* Animated Status Icon */}
                <AnimatePresence initial={false} mode="wait">
                  {file.status === 'completed' && (
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

                  {file.status === 'error' && (
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

                  {file.status === 'uploading' && (
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
                {file.status === 'uploading' && (
                  <Button
                    isIconOnly
                    startContent={
                      <CloseCircleIcon className="text-default-500" size={24} />
                    }
                    variant="light"
                    onPress={() => onAbort(file.id)}
                  />
                )}

                {file.status === 'pending' && (
                  <Button
                    isIconOnly
                    startContent={
                      <UploadIcon className="text-default-500" size={24} />
                    }
                    variant="light"
                    onPress={() => startUploads([file])}
                  />
                )}

                {file.status !== 'uploading' && (
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

                {file.status === 'error' && (
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
