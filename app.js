require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define el directorio y el archivo para guardar la ID del canal
const dataDir = path.join(__dirname, 'data');
const channelIdFile = path.join(dataDir, 'channelId.txt');

// Asegúrate de que el directorio exista
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Leer la ID del canal del archivo al iniciar la aplicación
let channelId = fs.existsSync(channelIdFile) ? fs.readFileSync(channelIdFile, 'utf8') : '';
let userName = process.env.USER_NAME;

app.post('/webhook', (req, res) => {
  let data = req.body;

  let channel = client.channels.cache.get(channelId); 
  if (channel) {
    const task = data.task.text;
    const streak = data.task.streak;
    if (data.direction === 'down') {
      channel.send(`${userName} ha desmarcado la tarea ${task} ha disminuido su puntuación`);
    } else{
      channel.send(`${userName} ha completado la tarea ${task} y tiene una racha de ${streak} días`);
    }
  }

  res.sendStatus(200);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  client.application.commands.create({
    name: 'channel',
    description: 'Establece el canal para los mensajes del webhook',
    options: [{
      name: 'channel',
      type: 7,
      description: 'El canal para los mensajes del webhook',
      required: true,
    }],
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'channel') {
    channelId = options.getChannel('channel').id;

    // Guardar la ID del canal en el archivo cada vez que se actualiza
    fs.writeFileSync(channelIdFile, channelId);

    await interaction.reply(`Canal configurado correctamente: ${channelId}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

const listener = app.listen(8080, () => {
  console.log('Tu app está escuchando en el puerto ' + listener.address().port);
});