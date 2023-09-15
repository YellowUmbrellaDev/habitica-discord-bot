require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defines de directory to store de chanel ID
const dataDir = path.join(__dirname, 'data');
const channelIdFile = path.join(dataDir, 'channelId.txt');

// Making sure the file exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Reading the chanel ID from the text file
let channelId = fs.existsSync(channelIdFile) ? fs.readFileSync(channelIdFile, 'utf8') : '';

// Split users chain
let users = process.env.USERS.split(',');
// Create a onject to map the name and user ID
let userIdToName = {};
for (let user of users) {
  let [id, name] = user.split(':');
  userIdToName[id] = name;
}

// Webhoock endpoint

app.post('/webhook', (req, res) => {
  let data = req.body;

  res.sendStatus(200);


  const task = data.task.text;
  const streak = data.task.streak;

  // Obtains the user name from the user ID

  let userName = userIdToName[data.task.userId];

  //Embeds

  // Task completed
  const taskUp = new EmbedBuilder()
    .setAuthor({
      name: "Tarea completada",
      url: "https://github.com/NereaCassian/habitica-discord-bot",
      iconURL: "https://i.imgur.com/QeqL3hz.png", //
    })
    .setTitle(`${userName}`)
    .setURL("https://habitica.com")
    .setDescription(`Ha completado la tarea **${task}** y esta en una racha de **${streak}** días`)
    .setThumbnail("https://i.imgur.com/PU7Wzos.png")
    .setColor("#A3C255")
    .setFooter({
      text: "Habitica Bot",
      iconURL: "https://i.imgur.com/PU7Wzos.png",
    })
    .setTimestamp();

  // Task uncheckd
  const taskDown = new EmbedBuilder()
    .setAuthor({
      name: "Tarea desmarcada",
      url: "https://github.com/NereaCassian/habitica-discord-bot",
      iconURL: "https://i.imgur.com/e2c2CZl.png", //
    })
    .setTitle(`${userName}`)
    .setURL("https://habitica.com")
    .setDescription(`Ha desmarcado la tarea **${task}** y ha disminuido su puntuación`)
    .setThumbnail("https://i.imgur.com/PU7Wzos.png")
    .setColor("#B34428")
    .setFooter({
      text: "Habitica Bot",
      iconURL: "https://i.imgur.com/PU7Wzos.png",
    })
    .setTimestamp();

  // Habit progress up
  const habitUp = new EmbedBuilder()
    .setAuthor({
      name: "Progreso en un hábito",
      url: "https://github.com/NereaCassian/habitica-discord-bot",
      iconURL: "https://i.imgur.com/IEP0zOA.png", //
    })
    .setTitle(`${userName}`)
    .setURL("https://habitica.com")
    .setDescription(`Ha progresado en el hábito **${task}**`)
    .setThumbnail("https://i.imgur.com/PU7Wzos.png")
    .setColor("#B3508D")
    .setFooter({
      text: "Habitica Bot",
      iconURL: "https://i.imgur.com/PU7Wzos.png",
    })
    .setTimestamp();

  // Habit progress down

  const habitDown = new EmbedBuilder()
    .setAuthor({
      name: "Retroceso en un hábito ",
      url: "https://github.com/NereaCassian/habitica-discord-bot",
      iconURL: "https://i.imgur.com/GZpw4VK.png", //
    })
    .setTitle(`${userName}`)
    .setURL("https://habitica.com")
    .setDescription(`Ha retrocedido en el hábito **${task}**`)
    .setThumbnail("https://i.imgur.com/PU7Wzos.png")
    .setColor("#3973AD")
    .setFooter({
      text: "Habitica Bot",
      iconURL: "https://i.imgur.com/PU7Wzos.png",
    })
    .setTimestamp();

  // TODO task compelted
  const todoUp = new EmbedBuilder()
    .setAuthor({
      name: "Tarea completada ",
      url: "https://github.com/NereaCassian/habitica-discord-bot",
      iconURL: "https://i.imgur.com/QeqL3hz.png", //
    })
    .setTitle(`${userName}`)
    .setURL("https://habitica.com")
    .setDescription(`Ha completado la tarea **${task}**`)
    .setThumbnail("https://i.imgur.com/PU7Wzos.png")
    .setColor("#A3C255")
    .setFooter({
      text: "Habitica Bot",
      iconURL: "https://i.imgur.com/PU7Wzos.png",
    })
    .setTimestamp();  

  // Sends a embed depending on the Type of task and the direction (up or down)
  let channel = client.channels.cache.get(channelId); 
  if (channel) {
    if (data.task.type === 'habit' && data.direction === 'down') {
      channel.send({ embeds: [habitDown] });
    } else if (data.task.type === 'habit' && data.direction === 'up') {
      channel.send({ embeds: [habitUp] });
    } else if (data.task.type === 'daily' && data.direction === 'down') {
      channel.send({ embeds: [taskDown] });
    } else if (data.task.type === 'daily' && data.direction === 'up'){
      channel.send({ embeds: [taskUp] });
    } else if (data.task.type === 'todo' && data.direction === 'up'){
      channel.send({ embeds: [todoUp] });
    } else{
      channel.send(`hmmm algo ha salido mal <@!418341963570479124>`);
    }
  }
});

// Intents

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});


// Commando for seting the chanel where the bot send the menssages

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

// Sends a confirmation and stores de channel ID in the text file

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'channel') {
    channelId = options.getChannel('channel').id;

    fs.writeFileSync(channelIdFile, channelId);

    await interaction.reply(`Canal configurado correctamente: ${channelId}`);
  }
});

// Discord bot token

client.login(process.env.DISCORD_BOT_TOKEN);

// Webhoock listener

const listener = app.listen(8080, () => {
  console.log('Tu app está escuchando en el puerto ' + listener.address().port);
});