import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filepath = join(process.cwd(), 'uploads', 'videos', filename);

    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }

    const videoBuffer = await readFile(filepath);
    
    // Determinar tipo MIME baseado na extensão
    let contentType = 'video/mp4';
    if (filename.endsWith('.webm')) {
      contentType = 'video/webm';
    } else if (filename.endsWith('.ogg')) {
      contentType = 'video/ogg';
    } else if (filename.endsWith('.mov')) {
      contentType = 'video/quicktime';
    }

    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': videoBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Erro ao servir vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar vídeo' },
      { status: 500 }
    );
  }
}
