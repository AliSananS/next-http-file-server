import path from 'path';

import { BreadcrumbsItemsProps, GetDataResult } from '@/types';

function createBreadcrumbsData(data: GetDataResult): BreadcrumbsItemsProps {
	const items: BreadcrumbsItemsProps = [];

	if (data.kind === 'dir' || data.kind === 'file') {
		// If the path is "." (root relative to baseDir), don't return any breadcrumbs
		if (data.path === '.' || data.path === './' || data.path === '') {
			return items;
		}

		const directoryTree = data.path.split('/');

		for (let i = 0; i < directoryTree.length; i++) {
			const fileName = directoryTree[i];
			const currentPath = directoryTree.slice(0, i + 1).join(path.sep);

			items.push({
				name: fileName,
				path: currentPath,
				type: i === directoryTree.length - 1 ? data.kind : 'dir',
			});
		}
	}

	return items;
}

export default createBreadcrumbsData;
