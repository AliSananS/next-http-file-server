// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const isDownload = url.searchParams.get('dl') === 'true';

	if (isDownload) {
		// Rewrite to internal API route, keep path
		url.pathname = `nhfs_dl${url.pathname}`;
		// url.searchParams.delete('dl'); // optional cleanup

		return NextResponse.rewrite(url);
	}

	return NextResponse.next();
}

// Only run for certain paths
export const config = {
	matcher: ['/:path*'], // Match your catch-all or public path
};
