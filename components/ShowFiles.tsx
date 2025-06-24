
import FilesContainer from './FilesContainer';
import FilesList from './FilesList';
import { ErrorIcon } from './icons';

import { getData } from '@/io-test';
import { FileEntryError, GetDataResult } from '@/types';
import { FileErrorMap } from '@/components/FileErrorMap';
import { log } from '@/lib/log';

export default async function ShowFiles({ params }: { params: string[] }) {
    // const breadcrumbsItems = await createBreadcrumbsData(path);
    const data = await getData(params);
    log.debug("Data:", data)
    return (
        <FilesContainer >
            <DisplayContent filesData={data} />
        </FilesContainer>
    );
}

async function DisplayContent({ filesData }: { filesData: GetDataResult }) {
    if ('error' in filesData) {
        return (
            <ErrorHandlerComponent
                error={filesData}
            />
        );
    }
    // Check for children to know that the file is a directory.
    if ('children' in filesData) {
        return <FilesList files={filesData} />;
    }
}

function ErrorHandlerComponent({ error }: { error: FileEntryError }) {
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
