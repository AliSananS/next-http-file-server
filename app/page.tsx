'use server';

import ShowFiles from "@/components/ShowFiles";
import { getData } from "@/io-test";
import { log } from "@/lib/log";

export default async function Home() {
    return <section className="">
        <ShowFiles params={["./"]} />
    </section>;
}
