'use server';

import ShowFiles from '@/components/ShowFiles';

export default async function Home() {
	return (
		<section className="">
			<ShowFiles params={['.']} />
		</section>
	);
}
