'use server';

import path from 'path';

import ShowFiles from '@/components/ShowFiles';

export default async function Home() {
  const dir = path.join('./');

  return <ShowFiles params={[dir]} />;
}
