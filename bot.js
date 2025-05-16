const { Client, GatewayIntentBits } = require('discord.js');

// Token do bot
const TOKEN = 'SEU_TOKEN_DO_DISCORD_AQUI';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} está online!`);
});

client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong! 🏓');
  }
});

client.login(TOKEN);
