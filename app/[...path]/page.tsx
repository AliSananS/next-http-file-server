import ShowFiles from '@/components/ShowFiles';

async function Page({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params.then(path => path);

  return <ShowFiles params={path} />;
}
export default Page;
