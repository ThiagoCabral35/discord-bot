const inquirer = require('inquirer');
const { exec } = require('child_process');
const fs = require('fs');

const options = [
  {
    type: 'list',
    name: 'action',
    message: 'Bem-vindo ao Biricutico, El Bot! O que deseja fazer?',
    choices: [
      'Iniciar o Bot',
      'Visualizar Termos de Serviço',
      'Visualizar Política de Privacidade',
      'Sair',
    ],
  },
];

function startBot() {
  console.log('Iniciando o bot... 🚀');
  const botProcess = exec('node bot.js');

  botProcess.stdout.on('data', (data) => {
    console.log(data);
  });

  botProcess.stderr.on('data', (data) => {
    console.error(`Erro: ${data}`);
  });

  botProcess.on('close', (code) => {
    console.log(`Bot encerrado com o código ${code}`);
    showMenu(); // Voltar ao menu após o bot ser encerrado
  });
}

function openFile(filePath) {
  if (fs.existsSync(filePath)) {
    exec(`start ${filePath}`, (err) => {
      if (err) {
        console.error(`Erro ao abrir o arquivo: ${filePath}`);
      }
    });
  } else {
    console.error(`Arquivo não encontrado: ${filePath}`);
  }
}

function showMenu() {
  inquirer.prompt(options).then((answers) => {
    switch (answers.action) {
      case 'Iniciar o Bot':
        startBot();
        break;
      case 'Visualizar Termos de Serviço':
        openFile('termos.html');
        showMenu(); // Voltar ao menu
        break;
      case 'Visualizar Política de Privacidade':
        openFile('privacidade.html');
        showMenu(); // Voltar ao menu
        break;
      case 'Sair':
        console.log('Encerrando... Até logo! 👋');
        process.exit(0);
        break;
      default:
        console.log('Opção inválida.');
        showMenu();
        break;
    }
  });
}

// Exibir o menu inicial
showMenu();
