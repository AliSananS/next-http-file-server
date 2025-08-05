import { FileTypes } from '@/types';
import { FolderIcon, FileIcon, FileRightIcon } from '@/components/icons';

export default function FileIconMap(fileType: FileTypes): JSX.Element {
  switch (fileType) {
    case 'dir':
      return <FolderIcon />;
    case 'file':
      return <FileIcon />;
    case 'symlink':
      return <FileRightIcon />;
    default:
      return <FileIcon />;
  }
}
