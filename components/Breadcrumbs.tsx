'use client';

import path from 'path';

import {
	BreadcrumbItem,
	Breadcrumbs as HeroBreadcrumbs,
} from '@heroui/breadcrumbs';

import { FileIcon, FolderIcon, HomeIcon } from '@/components/icons';
import { BreadcrumbsItemsProps } from '@/types';

export default function BreadCrumbs({
	items,
}: {
	items: BreadcrumbsItemsProps;
}) {
	return (
		<HeroBreadcrumbs>
			<BreadcrumbItem
				key="BASE_DIR"
				href="/"
				isCurrent={items.length < 1}
				startContent={<HomeIcon />}
			>
				{''}
			</BreadcrumbItem>
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
