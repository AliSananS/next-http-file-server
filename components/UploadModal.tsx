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
import { useEffect, useState } from 'react';
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

  const handleUploads = async () => {
    if (!files || files.length === 0) return;

    // Helper to upload a single file and return a promise
    const uploadFile = (fileEntry: UploadFileEntry): Promise<void> => {
      return new Promise<void>(resolve => {
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

            log.error('Upload error:', errorMessage);
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

    // Sequentially upload all pending files
    for (const fileEntry of files.filter(f => f.status === 'pending')) {
      await uploadFile(fileEntry);
    }
  };

  return (
    <Modal
      className=""
      classNames={{
        base: 'bg-content2 dark:bg-black border-1 border-divider max-h-[80%]',
      }}
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
            onPress={handleUploads}
          >
            Upload
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
    <div
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-divider p-4 transition-all duration-500 ${isDragActive && 'border-spacing-4 scale-[1.025] border-default-500 bg-content3/50'}`}
      {...rootProps()}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadIcon className="text-default-500" size={32} />
        <p className="font-medium">Drop your files here</p>
      </div>
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
      <input {...inputProps()} />
    </div>
  );
};

const FilesList = ({
  files,
  onAbort,
  onRemove,
  onClear,
}: {
  files: UploadFileEntry[];
  onAbort: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
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

      <ul className="flex max-h-72 flex-col gap-2 overflow-y-scroll scrollbar-hide">
        <AnimatePresence initial={false}>
          {files
            .slice()
            .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
            .map(file => (
              <motion.div
                key={file.id}
                layout
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-row items-center space-x-2"
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <li className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-content1 px-3 py-2 hover:bg-content1/70 dark:bg-content1/50 hover:dark:bg-content1/70">
                  {/* Left */}
                  <div className="flex items-center justify-center gap-2">
                    {FileIconMap(file.type || 'file')}
                    <div className="flex flex-col">
                      <span
                        className={`mr-2 text-sm ${
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

                  {/* Right */}
                  <div className="flex size-8 items-center justify-center">
                    {file.isUploading && (
                      <div className="flex items-center justify-center gap-1">
                        <CircularProgress
                          color={file.progress === 100 ? 'success' : 'primary'}
                          showValueLabel={true}
                          size="md"
                          value={file.progress}
                        />
                      </div>
                    )}

                    {!file.isUploading && file.status !== 'completed' && (
                      <Button
                        isIconOnly
                        size="sm"
                        startContent={
                          <BackspaceIcon
                            className="text-default-500"
                            size={24}
                          />
                        }
                        variant="light"
                        onPress={() => onRemove(file.id)}
                      />
                    )}
                    {file.status === 'completed' && (
                      <CheckmarkIcon className="text-success" />
                    )}
                    {file.status === 'error' && (
                      <ErrorIcon className="text-danger" />
                    )}
                  </div>
                </li>
                {file.isUploading && (
                  <Button
                    isIconOnly
                    startContent={
                      file.status === 'error' ? (
                        <RestartIcon className="text-default-500" size={24} />
                      ) : (
                        <CloseCircleIcon
                          className="text-default-500"
                          size={24}
                        />
                      )
                    }
                    variant="light"
                    onPress={() => onAbort(file.id)}
                  />
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};
