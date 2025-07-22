'use server';

import ShowFiles from '@/components/ShowFiles';

export default async function Home() {
  const filePath = './'.toString().trim();

  if (1 + 1) {
    return (
      <section>
        <ShowFiles params={[filePath]} />
      </section>
    );
  }
}
