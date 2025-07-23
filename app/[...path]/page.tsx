import ShowFiles from '@/components/ShowFiles';

export const dynamic = 'force-dynamic';
async function Page({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params.then(path => path);

  return <ShowFiles params={path} />;
}
export default Page;
