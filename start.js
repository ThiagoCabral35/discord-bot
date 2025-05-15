const inquirer = require('inquirer');
const { exec } = require('child_process');
const fs = require('fs');
const chalk = require('chalk'); // Importação correta para novas versões do chalk
const figlet = require('figlet');

// Função para exibir o título estilizado
function displayTitle() {
  console.clear();
  console.log(
    chalk.blue(
      figlet.textSync('Biricutico, El Bot', {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
  console.log(chalk.yellow('O bot mais divertido para o seu Discord! 🚀\n'));
}

const options = [
  {
    type: 'list',
    name: 'action',
    message: chalk.green('O que você deseja fazer?'),
    choices: [
      'Iniciar o Bot',
      'Acessar o Index (Links de Termos e Política)',
      'Sair',
    ],
  },
];

// Função para iniciar o bot
function startBot() {
  console.log(chalk.cyan('Iniciando o bot... 🚀'));
  const botProcess = exec('node bot.js');

  botProcess.stdout.on('data', (data) => {
    console.log(data);
  });

  botProcess.stderr.on('data', (data) => {
    console.error(chalk.red(`Erro: ${data}`));
  });

  botProcess.on('close', (code) => {
    console.log(chalk.magenta(`Bot encerrado com o código ${code}`));
    showMenu(); // Voltar ao menu após o bot ser encerrado
  });
}

// Função para abrir arquivos HTML
function openFile(filePath) {
  if (fs.existsSync(filePath)) {
    exec(`start ${filePath}`, (err) => {
      if (err) {
        console.error(chalk.red(`Erro ao abrir o arquivo: ${filePath}`));
      }
    });
  } else {
    console.error(chalk.red(`Arquivo não encontrado: ${filePath}`));
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
        console.log(chalk.blueBright('Encerrando... Até logo! 👋'));
        process.exit(0);
        break;
      default:
        console.log(chalk.red('Opção inválida.'));
        showMenu();
        break;
    }
  });
}

// Exibir o menu inicial
showMenu();
