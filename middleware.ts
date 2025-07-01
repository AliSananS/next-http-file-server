// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

import { log } from '@/lib/log';

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const isDownload = url.searchParams.get('dl') === 'true';

	// log.debug("isDownload:", isDownload, "\nURL.pathname:", url.pathname)
	if (isDownload) {
		// Rewrite to internal API route, keep path
		url.pathname = `nhfs_dl${url.pathname}`;
		url.searchParams.delete('dl'); // optional cleanup
		
		log.debug("New pathname:", `${url.pathname}`)

		return NextResponse.rewrite(url);
	}

	return NextResponse.next();
}

// Only run for certain paths
export const config = {
	matcher: ['/:path*'], // Match your catch-all or public path
};
