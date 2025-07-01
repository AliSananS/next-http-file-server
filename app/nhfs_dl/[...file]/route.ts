import * as fs from 'node:fs/promises';
import path from 'path';

import { NextRequest } from 'next/server';

import { log } from '@/lib/log';
import { downloadFile } from '@/lib/io';

export async function GET(
	req: NextRequest,
	{ params }: { params: { file: string[] } },
) {
	const filePath = path.join(...params.file);

	try {

		const fileData = await downloadFile(filePath);

        if (!fileData.error){
		const fileName = params.file[params.file.length - 1];

		return new Response(fileData.stream, {
			headers: {
				'Content-Type': fileData.contentType,
                'Content-Length': fileData.contentLength.toString(),
				'Content-Disposition': `attachment; filename="${fileName}"`,
			},
		});
        }


        log.debug("route.ts: FilePath:", filePath)

	} catch {
		return new Response('File not found', { status: 404 });
	}
}
