// Importando as bibliotecas necessárias
const { Client, GatewayIntentBits } = require('discord.js'); // Discord.js para interagir com o Discord
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice'); // Para funcionalidades de voz
const SpotifyWebApi = require('spotify-web-api-node'); // Para integração com o Spotify
const ytdl = require('youtube-dl-exec'); // Para baixar e tocar áudio do YouTube
require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

// Verificando se as credenciais estão configuradas
if (!process.env.DISCORD_TOKEN) {
  console.error(" O token do Discord não foi encontrado no arquivo .env.");
  process.exit(1);
}
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error(" As credenciais do Spotify não foram encontradas no arquivo .env.");
  process.exit(1);
}

// Configuração do cliente do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

// Configuração do cliente do Spotify
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Evento para verificar se o bot está online
client.once('ready', () => {
  console.log(` Bot conectado como ${client.user.tag}`);
});

// Evento para processar mensagens
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).split(' ');
  const command = args.shift().toLowerCase();

  // Comando: !play
  if (command === 'play') {
    const query = args.join(' ');
    if (!query) {
      message.reply('❗ Por favor, forneça o nome ou link da música.');
      return;
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('❗ Você precisa estar em um canal de voz para usar este comando.');
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    try {
      message.reply(`🔍 Buscando: **${query}**...`);
      const searchResult = await ytdl(`ytsearch:${query}`, { dumpSingleJson: true, noCheckCertificate: true });
      const video = searchResult.entries[0];
      const videoUrl = video.url;

      const audioPlayer = createAudioPlayer();
      const resource = createAudioResource(ytdl(videoUrl, { format: 'bestaudio' }));

      connection.subscribe(audioPlayer);
      audioPlayer.play(resource);

      message.reply(`🎵 Tocando agora: **${video.title}**`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Não foi possível encontrar ou tocar a música.');
    }
  }

  // Comando: !spotify
  if (command === 'spotify') {
    const query = args.join(' ');
    if (!query) {
      message.reply('❗ Por favor, forneça o nome da música ou artista.');
      return;
    }

    try {
      const tokenResponse = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(tokenResponse.body['access_token']);

      const searchResult = await spotifyApi.searchTracks(query);
      if (searchResult.body.tracks.items.length === 0) {
        message.reply('❌ Nenhuma música encontrada no Spotify.');
        return;
      }

      const track = searchResult.body.tracks.items[0];
      message.reply(`🎶 **${track.name}** de **${track.artists[0].name}**\n🔗 [Ouça no Spotify](${track.external_urls.spotify})`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Não foi possível buscar a música no Spotify.');
    }
  }
});

// Iniciando o bot
client.login(process.env.DISCORD_TOKEN);

