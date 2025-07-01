import * as fs from 'node:fs/promises';
import path from 'path';

import { NextRequest } from 'next/server';

import { log } from '@/lib/log';

export async function GET(
	req: NextRequest,
	{ params }: { params: { file: string[] } },
) {
	const filePath = path.join(...params.file);

	log.debug("route.ts filePath:", params.file)

	try {
		const fileBuffer = await fs.readFile(filePath);
		const fileName = params.file[params.file.length - 1];

        log.debug("route.ts: FilePath:", filePath)

		return new Response(fileBuffer, {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': `attachment; filename="${fileName}"`,
			},
		});
	} catch (err) {
		return new Response('File not found', { status: 404 });
	}
}
