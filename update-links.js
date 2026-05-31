const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');

// Mapeamento completo de navegação entre páginas
const navMap = {
  // Bottom nav do aluno
  'home': '/pages/dashboard_do_aluno/code.html',
  'dumbbell': '/pages/player_de_treino/code.html',
  'message-circle': '/pages/mensagens_do_personal/code.html',
  'user': '/pages/perfil_do_aluno/code.html',
  
  // Bottom nav do trainer
  'layout-dashboard': '/pages/dashboard_do_personal/code.html',
  'users': '/pages/lista_de_alunos/code.html',
  'clipboard-list': '/pages/builder_de_plano_de_treino/code.html',
  
  // Outros
  'chart-bar': '/pages/cron_metros_de_performance/code.html',
  'trophy': '/pages/comunidade_e_conquistas/code.html',
  'book-open': '/pages/biblioteca_de_exerc_cios/code.html',
  'calendar': '/pages/hist_rico_de_avalia_es_do_aluno/code.html',
  'settings': '/pages/perfil_do_aluno/code.html',
  'bell': '/pages/dashboard_do_aluno/code.html',
  'arrow-left': 'javascript:history.back()',
  'x': 'javascript:history.back()',
};

// Texto de links para páginas específicas
const textNavMap = {
  'sou personal trainer': '/pages/login_do_aluno/code.html', // Muda para login do personal quando existir
  'sou aluno': '/pages/login_do_aluno/code.html',
  'entrar': '/pages/dashboard_do_aluno/code.html',
  'iniciar treino': '/pages/player_de_treino/code.html',
  'começar': '/pages/dashboard_do_aluno/code.html',
  'ver todos': '/pages/lista_de_alunos/code.html',
  'ver mais': '/pages/hist_rico_de_avalia_es_do_aluno/code.html',
  'nova avaliação': '/pages/nova_avalia_o_f_sica/code.html',
  'novo treino': '/pages/builder_de_plano_de_treino/code.html',
  'criar plano': '/pages/builder_de_plano_de_treino/code.html',
  'biblioteca': '/pages/biblioteca_de_exerc_cios/code.html',
};

// Imagem placeholder para URLs quebradas
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%231a1a1a" width="400" height="300"/%3E%3Ctext fill="%23c8ff00" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EExercise Demo%3C/text%3E%3C/svg%3E';

function updateHtmlFile(filePath, folderName) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = 0;

  // 1. Corrigir links com data-icon
  Object.entries(navMap).forEach(([icon, targetPage]) => {
    // Padrão: data-icon="xxx" ... href="#"
    const pattern1 = new RegExp(`(<[^>]*data-icon="${icon}"[^>]*)href="#"`, 'gi');
    if (pattern1.test(content)) {
      content = content.replace(pattern1, `$1href="${targetPage}"`);
      changes++;
    }
    
    // Padrão: href="#" ... data-icon="xxx"
    const pattern2 = new RegExp(`href="#"([^>]*data-icon="${icon}")`, 'gi');
    if (pattern2.test(content)) {
      content = content.replace(pattern2, `href="${targetPage}"$1`);
      changes++;
    }
  });

  // 2. Corrigir links com texto específico
  Object.entries(textNavMap).forEach(([text, targetPage]) => {
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`href="#"([^>]*>[^<]*${escapedText})`, 'gi');
    if (pattern.test(content)) {
      content = content.replace(pattern, `href="${targetPage}"$1`);
      changes++;
    }
  });

  // 3. Substituir URLs de imagens quebradas do Google por placeholder
  const googleImagePattern = /src="https:\/\/lh3\.googleusercontent\.com[^"]*"/g;
  if (googleImagePattern.test(content)) {
    content = content.replace(googleImagePattern, `src="${placeholderImage}"`);
    changes++;
  }

  // 4. Remover script antigo se existir e adicionar novo
  content = content.replace(/<script>\s*\/\/ Navigation handler[\s\S]*?<\/script>\s*/g, '');
  
  const navScript = `
<script>
// Navigation handler v2
document.addEventListener('click', function(e) {
  const target = e.target.closest('button, a, [data-icon]');
  if (!target) return;

  // Rotas por ícone
  const iconRoutes = {
    'home': '/pages/dashboard_do_aluno/code.html',
    'dumbbell': '/pages/player_de_treino/code.html',
    'message-circle': '/pages/mensagens_do_personal/code.html',
    'user': '/pages/perfil_do_aluno/code.html',
    'layout-dashboard': '/pages/dashboard_do_personal/code.html',
    'users': '/pages/lista_de_alunos/code.html',
    'clipboard-list': '/pages/builder_de_plano_de_treino/code.html',
    'arrow-left': 'back',
    'x': 'back',
    'chevron-left': 'back'
  };

  // Rotas por texto do botão
  const textRoutes = {
    'iniciar treino': '/pages/player_de_treino/code.html',
    'entrar': '/pages/dashboard_do_aluno/code.html',
    'começar': '/pages/dashboard_do_aluno/code.html',
    'ver todos': '/pages/lista_de_alunos/code.html',
    'ver histórico': '/pages/hist_rico_de_avalia_es_do_aluno/code.html',
    'nova avaliação': '/pages/nova_avalia_o_f_sica/code.html',
    'novo treino': '/pages/builder_de_plano_de_treino/code.html',
    'criar plano': '/pages/builder_de_plano_de_treino/code.html',
    'adicionar exercício': '/pages/selecionar_exerc_cio/code.html',
    'salvar': '/pages/dashboard_do_personal/code.html',
    'concluir': '/pages/dashboard_do_aluno/code.html',
    'finalizar': '/pages/dashboard_do_aluno/code.html',
    'próximo': 'next',
    'anterior': 'back',
    'voltar': 'back'
  };

  // Verificar por ícone
  const icon = target.getAttribute('data-icon');
  if (icon && iconRoutes[icon]) {
    e.preventDefault();
    if (iconRoutes[icon] === 'back') {
      history.back();
    } else {
      window.location.href = iconRoutes[icon];
    }
    return;
  }

  // Verificar por texto do botão
  const buttonText = target.textContent.toLowerCase().trim();
  for (const [text, route] of Object.entries(textRoutes)) {
    if (buttonText.includes(text)) {
      e.preventDefault();
      if (route === 'back') {
        history.back();
      } else if (route === 'next') {
        // Noop ou implementar próximo
      } else {
        window.location.href = route;
      }
      return;
    }
  }
});

// Adicionar cursor pointer em elementos clicáveis
document.querySelectorAll('button, [data-icon]').forEach(el => {
  el.style.cursor = 'pointer';
});
</script>
`;
  content = content.replace('</body>', navScript + '</body>');
  changes++;

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${folderName}: ${changes} alterações`);
  }

  return changes;
}

function processAllPages() {
  const entries = fs.readdirSync(pagesDir, { withFileTypes: true });
  let totalChanges = 0;
  let filesUpdated = 0;

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      const htmlPath = path.join(pagesDir, entry.name, 'code.html');
      if (fs.existsSync(htmlPath)) {
        const changes = updateHtmlFile(htmlPath, entry.name);
        if (changes > 0) {
          totalChanges += changes;
          filesUpdated++;
        }
      }
    }
  });

  console.log(`\n========================================`);
  console.log(`Total: ${filesUpdated} arquivos atualizados`);
  console.log(`Total: ${totalChanges} alterações feitas`);
  console.log(`========================================`);
}

processAllPages();
