import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const folderName = slug.join('/');

  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'pages',
      folderName,
      'code.html'
    );

    const htmlContent = await fs.readFile(filePath, 'utf-8');

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch {
    return new NextResponse('Página não encontrada', { status: 404 });
  }
}
