import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo inválido. Apenas vídeos são permitidos.' },
        { status: 400 }
      );
    }

    // Validar tamanho (max 300MB)
    const maxSize = 300 * 1024 * 1024; // 300MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 300MB' },
        { status: 400 }
      );
    }

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), 'uploads', 'videos');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = join(uploadDir, filename);

    // Converter o arquivo para buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Retornar o caminho relativo do arquivo
    const videoUrl = `/api/videos/${filename}`;

    return NextResponse.json({ 
      success: true, 
      videoUrl,
      message: 'Vídeo enviado com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload' },
      { status: 500 }
    );
  }
}
