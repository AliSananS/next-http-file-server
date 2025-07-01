import path from 'path';

import { BreadcrumbsItemsProps, GetDataResult } from '@/types';
import { log } from '@/lib/log';

function createBreadcrumbsData(data: GetDataResult): BreadcrumbsItemsProps {
	const items: BreadcrumbsItemsProps = [];

	if (data.kind === 'dir' || data.kind === 'file') {
		log.debug('data:', data.name, data.path);

		// If the path is "." (root relative to baseDir), don't return any breadcrumbs
		if (data.path === '.' || data.path === './' || data.path === '') {
			return items;
		}

		const directoryTree = data.path.split('/');

		for (let i = 0; i < directoryTree.length; i++) {
			const fileName = directoryTree[i];
			const currentPath = directoryTree.slice(0, i + 1).join(path.sep);

			log.debug('currentFile:', currentPath);

			items.push({
				name: fileName,
				path: currentPath,
				type: i === directoryTree.length - 1 ? data.kind : 'dir',
			});
		}
	}

	log.debug('createBreadcrumbs.ts:', items);

	return items;
}

export default createBreadcrumbsData;
