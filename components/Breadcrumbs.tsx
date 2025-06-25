'use client';

import {
	Breadcrumbs as HeroBreadcrumbs,
	BreadcrumbItem,
} from '@heroui/breadcrumbs';

import { FileIcon, FolderIcon, HomeIcon } from '@/components/icons';
import { BreadcrumbsItemsProps } from '@/types';

export default function BreadCrumbs({
	items,
}: {
	items: BreadcrumbsItemsProps;
}) {
	console.log('Breadcrumbs items:', items);

	return (
		<HeroBreadcrumbs>
			{items.map((item, index) => (
				<BreadcrumbItem
					key={item.name}
					href={items.length !== 0 ? '/' : '/' + item.path}
					startContent={
						index === 0 ? (
							<HomeIcon />
						) : item.type === 'dir' ? (
							<FolderIcon />
						) : (
							<FileIcon />
						)
					}
				>
					{index === 0 ? '' : item.name}
				</BreadcrumbItem>
			))}
		</HeroBreadcrumbs>
	);
}
