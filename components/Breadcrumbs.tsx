'use client';

import path from 'path';

import {
	Breadcrumbs as HeroBreadcrumbs,
	BreadcrumbItem,
} from '@heroui/breadcrumbs';

import { FileIcon, FolderIcon, HomeIcon } from '@/components/icons';
import { BreadcrumbsItemsProps } from '@/types';
import { log } from '@/lib/log';

export default function BreadCrumbs({
	items,
}: {
	items: BreadcrumbsItemsProps;
}) {
	// items.forEach(item => log.debug("href", item.path))

	return (
		<HeroBreadcrumbs>
			<BreadcrumbItem key="BASE_DIR" href="/" isCurrent={items.length === 1 ? true : false }  startContent={<HomeIcon />}>{""}</BreadcrumbItem>
			{items.map(item => (
				<BreadcrumbItem
					key={item.name}
					href={path.join('/', item.path)}
					startContent={item.type === 'dir' ? <FolderIcon /> : <FileIcon />}
				>
					{item.name}
				</BreadcrumbItem>
			))}
		</HeroBreadcrumbs>
	);
}
