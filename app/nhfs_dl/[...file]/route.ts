import { createReadStream, statSync } from 'fs';

import { NextRequest } from 'next/server';
import mime from 'mime-types';

import { getData, convertParams } from '@/lib/io';
import { log } from '@/lib/log';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> },
) {
  const { file } = await params;
  const result = await getData(file);

  if (!result.ok) {
    if (result.error.code === 'ENOENT') {
      return new Response('Not Found', { status: 404 });
    }
    if (result.error.code === 'EACCES') {
      return new Response('Forbidden', { status: 403 });
    }

    return new Response('Internal Server Error', { status: 500 });
  }

  // Directory listing as JSON
  if ('children' in result.value) {
    return Response.json(result.value);
  }

  // File serving
  const relPath = convertParams(file);
  const filePath = require('path').resolve(
    process.env.BASE_DIR || process.cwd(),
    relPath,
  );

  // Check again for permissions
  if (result.value.permissions === 'EACCES') {
    return new Response('Forbidden', { status: 403 });
  }

  // Stream file
  try {
    const stat = statSync(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    const headers = new Headers({
      'Content-Type': mimeType,
      'Content-Length': stat.size.toString(),
      'Last-Modified': stat.mtime.toUTCString(),
      'Cache-Control': 'public, max-age=31536000', // 1 year
      'Content-Disposition': `inline; filename="${encodeURIComponent(result.value.name)}"`,
    });

    // @ts-ignore
    return new Response(createReadStream(filePath), { status: 200, headers });
  } catch (err) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
