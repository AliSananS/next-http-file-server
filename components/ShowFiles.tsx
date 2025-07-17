import FilesContainer from './FilesContainer';

import { getData } from '@/lib/io';

export default async function ShowFiles({ params }: { params: string[] }) {
  const data = await getData(params);

  return <FilesContainer filesData={data} />;
}
