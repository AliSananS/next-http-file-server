import { Button } from '@heroui/button';
import React, { ReactNode } from 'react';
import { Divider } from '@heroui/divider';

import { AddFolderIcon, UploadIcon } from '@/components/icons';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BreadcrumbsItemsProps } from '@/types';

type Props = {
	children: ReactNode;
	breadcrumbsItems?: BreadcrumbsItemsProps;
};

async function FilesContainer({ children, breadcrumbsItems }: Props) {
	return (
		<div className="mb-8 flex h-full min-h-96 w-full flex-col gap-4 rounded-2xl border-1 border-divider p-4">
			<div className="flex w-full items-center justify-between">
				<Breadcrumbs items={breadcrumbsItems || []} />
				<div className="flex gap-2">
					<Button
						color="default"
						endContent={<AddFolderIcon />}
						size="sm"
						variant="light"
					>
						New folder
					</Button>
					<Button
						color="primary"
						endContent={<UploadIcon />}
						size="sm"
						variant="solid"
					>
						Upload
					</Button>
				</div>
			</div>
			<Divider className="" />
			{children}
		</div>
	);
}

export default FilesContainer;
