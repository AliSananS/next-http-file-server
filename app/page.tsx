'use server';
export const dynamic = 'force-dynamic';
import path from 'path';

import ShowFiles from '@/components/ShowFiles';

export default async function Home() {
  const baseDirectoryPath = process.env.BASE_DIR;

  return (
    <section>
      <ShowFiles params={['./']} />
    </section>
  );
}
