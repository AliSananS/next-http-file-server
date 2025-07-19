import { ReactNode } from 'react';

import { FileErrorMap as ErrorMsgMapType } from '@/types/fileErrors';
import { ErrorIcon, FolderErrorIcon } from '@/components/icons';

export const FileErrorMap: Record<
  string,
  { message: string; icon: ReactNode }
> = {
  ENOENT: {
    message: ErrorMsgMapType.ENOENT.message,
    icon: <FolderErrorIcon />,
  },
  EACCES: {
    message: ErrorMsgMapType.EACCES.message,
    icon: <ErrorIcon />,
  },
  UNKNOWN: {
    message: ErrorMsgMapType.UNKNOWN.message,
    icon: <ErrorIcon />,
  },
};
