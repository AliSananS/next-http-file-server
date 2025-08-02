import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { FileRejection, useDropzone } from 'react-dropzone';

type DropzoneContextType = {
  acceptedFiles: File[];
  rejectedFiles: import('react-dropzone').FileRejection[];
  getRootProps: <T extends DropzoneRootProps>(
    props?: T | undefined,
  ) => DropzoneRootProps;
  getInputProps: <T extends DropzoneInputProps>(
    props?: T | undefined,
  ) => DropzoneInputProps;
  isDragActive: boolean;
  open: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isFileDialogActive: boolean;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined,
);

export const DropzoneProvider = ({ children }: { children: ReactNode }) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    setAcceptedFiles(prev => [...prev, ...accepted]);
    setRejectedFiles(prev => [...prev, ...rejected]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    inputRef,
    isFileDialogActive,
    open,
  } = useDropzone({ onDrop });

  const contextValue = {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    inputRef,
    isFileDialogActive,
  };

  return (
    <DropzoneContext.Provider value={contextValue}>
      {children}
    </DropzoneContext.Provider>
  );
};

export const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error(
      'useDropzoneContext must be used within a DropzoneProvider',
    );
  }

  return context;
};
