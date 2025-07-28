import { writeFile } from 'fs/promises';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  try {
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadPath = path.join(process.cwd(), 'uploads', file.name);

      await writeFile(uploadPath, buffer);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Upload error:', err);

    return NextResponse.json(
      { ok: false, error: 'UPLOAD_FAILED' },
      { status: 500 },
    );
  }
}
