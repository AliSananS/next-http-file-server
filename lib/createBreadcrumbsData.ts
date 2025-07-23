import path from 'path';

import { BreadcrumbsItemsProps, GetDataResult } from '@/types';

function createBreadcrumbsData(data: GetDataResult): BreadcrumbsItemsProps {
  const items: BreadcrumbsItemsProps = [];

  if (!data.ok) {
    return items;
  }

  const value = data.value;

  // If the path is "." (root relative to baseDir), don't return any breadcrumbs
  if (value.path === '.' || value.path === './' || value.path === '') {
    return items;
  }

  const directoryTree = value.path.split('/');

  for (let i = 0; i < directoryTree.length; i++) {
    const fileName = directoryTree[i];
    const currentPath = directoryTree.slice(0, i + 1).join(path.sep);

    items.push({
      name: fileName,
      path: currentPath,
      type:
        i === directoryTree.length - 1
          ? 'children' in value
            ? 'dir'
            : 'file'
          : 'dir',
    });
  }

  return items;
}

export default createBreadcrumbsData;
