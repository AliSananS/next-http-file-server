import { resolve as resolveURL } from 'node:url';

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Check if the request is to download the file
  const url = req.nextUrl.clone();
  const isDownload = url.searchParams.get('dl') === 'true';

  if (isDownload) {
    url.pathname = `nhfs_dl${url.pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
