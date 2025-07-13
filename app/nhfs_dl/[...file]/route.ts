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
  const data = await getData(file);

  if (data.kind === 'error') {
    if (data.errorCode === 'ENOENT') {
      return new Response('Not Found', { status: 404 });
    }
    if (data.errorCode === 'EACCES') {
      return new Response('Forbidden', { status: 403 });
    }

    return new Response('Internal Server Error', { status: 500 });
  }

  // Directory listing as JSON
  if (data.kind === 'dir') {
    return Response.json(data);
  }

  // File serving
  if (data.kind === 'file') {
    const relPath = convertParams(file);
    const filePath = require('path').resolve(
      process.env.BASE_DIR || process.cwd(),
      relPath,
    );

    // Check again for permissions
    if (data.permissions === 'EACCES') {
      return new Response('Forbidden', { status: 403 });
    }

    // Stream file
    try {
      const stat = statSync(filePath);
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';

      log.debug('Mine type for file:', mimeType);
      const headers = new Headers({
        'Content-Type': mimeType,
        'Content-Length': stat.size.toString(),
        'Last-Modified': stat.mtime.toUTCString(),
        'Cache-Control': 'public, max-age=31536000', // 1 year
        'Content-Disposition': `inline; filename="${encodeURIComponent(data.name)}"`,
      });

      // @ts-ignore
      return new Response(createReadStream(filePath), { status: 200, headers });
    } catch (err) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // Fallback
  return new Response('Internal Server Error', { status: 500 });
}
