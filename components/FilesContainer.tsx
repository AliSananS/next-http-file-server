import { Button } from '@heroui/button';
import React from 'react';
import { Divider } from '@heroui/divider';
import Link from 'next/link';

import { AddFolderIcon, ErrorIcon, UploadIcon } from '@/components/icons';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FileEntry, FileEntryError, GetDataResult } from '@/types';
import FilesList from '@/components/FilesList';
import { FileErrorMap } from '@/components/FileErrorMap';
import createBreadcrumbsData from '@/lib/createBreadcrumbsData';
import fileTypeMap from '@/lib/fileTypeMap';
import ImageView from '@/components/ImageView';
import {log} from "@/lib/log";

export default async function FilesContainer({
	filesData,
}: {
	filesData: GetDataResult;
}) {
	const breadCrumbsData = createBreadcrumbsData(filesData);

	return (
		<div className="mb-8 flex h-full min-h-96 w-full flex-col gap-4 rounded-2xl border-1 border-divider p-4">
			<HeaderSection breadCrumbsData={breadCrumbsData} />
			<Divider />
			<MainContent filesData={filesData} />
		</div>
	);
}

function HeaderSection({ breadCrumbsData }: { breadCrumbsData: any }) {
	return (
		<div className="flex w-full items-center justify-between">
			<Breadcrumbs items={breadCrumbsData} />
			<ActionButtons />
		</div>
	);
}

function ActionButtons() {
	return (
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
	);
}

async function MainContent({ filesData }: { filesData: GetDataResult }) {
	if (filesData.kind === 'error') {
		return <ErrorHandler error={filesData} />;
	}
	if (filesData.kind === 'dir') {
		return <FilesList files={filesData} />;
	}
	if (filesData.kind === 'file' && fileTypeMap.hasOwnProperty(filesData.type)) {
		return <FileViewer file={filesData} />;
	}

	return (
		<p>
			Unsupported file.{' '}
			<Link className="text-blue-500" href={`/${filesData.path}?dl=true`}>
				Download
			</Link>
		</p>
	);
}

function FileViewer({ file }: { file: FileEntry }) {
	if (file.type === 'image') {
		return <ImageView src={`/${file.path}?dl=true`} />;
	}
}

function ErrorHandler({ error }: { error: FileEntryError }) {
	const { message, icon } = FileErrorMap[error.errorCode] || {
		message: 'Unknown error occurred',
		icon: <ErrorIcon />,
	};

	return (
		<div className="flex h-full w-full items-center justify-center gap-2">
			{icon}
			<p className="text-lg font-medium">{message}</p>
		</div>
	);
}