'use server';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { writeFile } from '@/lib/io';
import ErrorCodeMap from '@/types/ErrorCodeMap';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];
  const uploadPath = formData.getAll('path')[0] as string;

  for (const file of files) {
    const filePath = path.join(uploadPath, file.name);

    const result = await writeFile(filePath, file);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: ErrorCodeMap[result.error] || 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
