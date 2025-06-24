import { BreadcrumbsItemsProps } from '@/types';
import { getFileInfo } from '@/lib/io';

export default async function createBreadcrumbsData(path: string[]) {
    const breadcrumbs: BreadcrumbsItemsProps = [];
    let currentPath: string[] = [];

    for (let i = 0; i < path.length; i++) {
        currentPath = path.slice(0, i + 1);
        const info = await getFileInfo(currentPath);

        breadcrumbs.push({
            name: path[i],
            path: [...currentPath].join('/'),
            type: info?.type === 'dir' ? 'dir' : 'file',
        });
    }
    console.log(breadcrumbs);

    return breadcrumbs;
}
