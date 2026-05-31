import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug = [] } = await params;
  
  // Reconstruct the folder name from slug
  const folderName = slug.join('/');
  
  if (!folderName) {
    return notFound();
  }

  try {
    // Read the HTML file from the pages folder
    const filePath = path.join(
      process.cwd(),
      'public',
      'pages',
      folderName,
      'code.html'
    );

    const htmlContent = await fs.readFile(filePath, 'utf-8');

    // Return HTML with proper wrapper
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                  }
                  .page-wrapper {
                    width: 100%;
                    min-height: 100vh;
                  }
                </style>
              </head>
              <body>
                <div class="page-wrapper">
                  ${htmlContent}
                </div>
              </body>
            </html>
          `,
        }}
      />
    );
  } catch (error) {
    console.log('Erro ao carregar página:', folderName, error);
    return notFound();
  }
}

export async function generateStaticParams() {
  const pagesDir = path.join(process.cwd(), 'public', 'pages');
  
  try {
    const entries = await fs.readdir(pagesDir, { withFileTypes: true });
    const folders = entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        slug: [entry.name],
      }));

    return folders;
  } catch (error) {
    console.error('Erro ao gerar params:', error);
    return [];
  }
}
