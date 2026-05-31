const fs = require('fs');
const path = require('path');

// Mapeamento de ícones e nomes de páginas para rotas
const iconPageMap = {
  'home': 'dashboard_do_aluno',
  'workouts': 'player_de_treino',
  'training': 'player_de_treino',
  'workout': 'player_de_treino',
  'chat': 'conversas_com_personal',
  'message': 'conversas_com_personal',
  'profile': 'perfil_do_aluno',
  'user': 'perfil_do_aluno',
  'stats': 'cron_metros_de_performance',
  'performance': 'cron_metros_de_performance',
  'community': 'comunidade_e_conquistas',
  'achievements': 'comunidade_e_conquistas',
  'exercises': 'biblioteca_de_exerc_cios',
  'library': 'biblioteca_de_exerc_cios',
};

// Página padrão para links sem ícone
const defaultPageMap = {
  'trainer': 'dashboard_do_personal',
  'student': 'dashboard_do_aluno',
  'login': 'login_do_aluno',
};

const pagesDir = path.join(__dirname, 'public', 'pages');

function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;

  // Atualizar links com data-icon
  Object.entries(iconPageMap).forEach(([icon, page]) => {
    const regex = new RegExp(`data-icon="[^"]*${icon}[^"]*"[^>]*href="#"`, 'g');
    if (regex.test(content)) {
      content = content.replace(
        new RegExp(`(data-icon="[^"]*${icon}[^"]*"[^>]*)href="#"`, 'g'),
        `$1href="/p/${page}"`
      );
      updated = true;
    }
  });

  // Atualizar links com text content
  Object.entries(defaultPageMap).forEach(([text, page]) => {
    const regex = new RegExp(`href="#"[^>]*>\\s*${text}`, 'gi');
    if (regex.test(content)) {
      content = content.replace(
        new RegExp(`href="#"([^>]*>\\s*${text})`, 'gi'),
        `href="/p/${page}"$1`
      );
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Atualizado: ${filePath}`);
  }

  return updated;
}

function processAllPages() {
  const entries = fs.readdirSync(pagesDir, { withFileTypes: true });
  let count = 0;

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      const htmlPath = path.join(pagesDir, entry.name, 'code.html');
      if (fs.existsSync(htmlPath)) {
        if (updateHtmlFile(htmlPath)) {
          count++;
        }
      }
    }
  });

  console.log(`\n✓ Total de arquivos atualizados: ${count}`);
}

processAllPages();
