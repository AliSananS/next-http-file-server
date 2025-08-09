import ShowFiles from '@/components/ShowFiles';

export const revalidate = 0;

export default function Home() {
  return <ShowFiles params={['./']} />;
}
