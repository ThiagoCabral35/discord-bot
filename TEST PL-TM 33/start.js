const inquirer = require('inquirer');
const { exec } = require('child_process');
const fs = require('fs');

// Função para exibir o título estilizado
function displayTitle() {
  console.clear();
  console.log('Biricutico, El Bot');
  console.log('O bot mais divertido para o seu Discord! 🚀\n');
}

const options = [
  {
    type: 'list',
    name: 'action',
    message: 'O que você deseja fazer?',
    choices: [
      'Iniciar o Bot',
      'Acessar o Index (Links de Termos e Política)',
      'Sair',
    ],
  },
];

// Função para iniciar o bot
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

// Função para abrir arquivos HTML
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

// Função para exibir o menu interativo
function showMenu() {
  displayTitle();

  inquirer.prompt(options).then((answers) => {
    switch (answers.action) {
      case 'Iniciar o Bot':
        startBot();
        break;
      case 'Acessar o Index (Links de Termos e Política)':
        openFile('index.html');
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
