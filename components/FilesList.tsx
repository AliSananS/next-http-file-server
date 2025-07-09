'use client';
import Link from 'next/link';

import { MenuDotsIcon } from './icons';

import { DirEntery } from '@/types';
import IconMap from '@/components/fileExtensionToIconMap';

export default function FilesList({ files }: { files: DirEntery }) {
	return (
		<div className="flex flex-col gap-2">
			{files.children.map(file => (
				<Link
					key={file.path.toString()}
					className="flex w-full flex-row justify-between rounded-md bg-content2/75 hover:cursor-pointer hover:bg-content2 dark:bg-content1/75 hover:dark:bg-content1 sm:py-2 lg:py-0"
					href={'/' + file.path.toString()}
				>
					<LeftWrapper icon={IconMap(file.type)} title={file.name} />
					<RightWrapper />
				</Link>
			))}
		</div>
	);
}

const LeftWrapper = ({ title, icon }: { title: string; icon: JSX.Element }) => {
	return (
		<div className="m-2 flex flex-row items-center gap-2">
			{icon}
			<p className="w-[80%] overflow-clip text-nowrap text-sm font-light antialiased">
				{title}
			</p>
		</div>
	);
};

const RightWrapper = () => {
	return (
		<div className="flex flex-row items-center gap-2">
			<div className="rounded-full p-1 hover:cursor-pointer hover:bg-content2">
				{/* @ts-ignore */}
				<MenuDotsIcon weight="Bold" />
			</div>
		</div>
	);
};
