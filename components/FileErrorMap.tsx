import { ReactNode } from 'react';

import { ErrorIcon, FolderErrorIcon } from '@/components/icons';

export const FileErrorMap: Record<
  string,
  { message: string; icon: ReactNode }
> = {
  ENOENT: {
    message: 'No such a file or directory',
    icon: <FolderErrorIcon />,
  },
  EACCES: {
    message: 'Permission denied',
    icon: <ErrorIcon />,
  },
  UNKNOWN: {
    message: "An Error we don't know",
    icon: <ErrorIcon />,
  },
};
