import path from 'path';

import { NextApiRequest } from 'next';

import { downloadFile } from '@/lib/io';

export async function GET(
	req: NextApiRequest,
	{ params }: { params: Promise<{ file: string[] }> },
) {
	const { file } = await params;
	const filePath = path.join(...file);

	try {
		const fileData = await downloadFile(filePath);

		if (!fileData.error) {
			const fileName = file[file.length - 1];

			return new Response(fileData.stream, {
				headers: {
					'Content-Type': fileData.contentType,
					'Content-Length': fileData.contentLength.toString(),
					'Content-Disposition': `attachment; filename="${fileName}"`,
				},
			});
		}
	} catch {
		return new Response('File not found', { status: 404 });
	}
}
