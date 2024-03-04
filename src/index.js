const { Client, ActionRowBuilder, GatewayIntentBits, Events, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ButtonBuilder, ButtonStyle, Partials } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const { ChannelType } = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');
const fs = require('fs');
require('dotenv').config();
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMessageTyping,
  ],

  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User
  ]
});

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(process.env.token)
})();


// TICKET SYSTEM =========================================================

const ticketSchema = require("./Schemas/ticketSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "ticket") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });

      if (!data) return await interaction.reply({ content: "Ticket system is not setup in this server", ephemeral: true })
      const role = guild.roles.cache.get(data.Role)
      const cate = data.Category;


      await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        parent: cate,
        type: ChannelType.GuildText,
        topic: `Ticket Owner: ${interaction.user.id}`,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["ViewChannel"]
          },
          {
            id: role.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]

          },
          {
            id: interaction.member.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
        ],
      }).then(async (channel) => {
        const openembed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Ein Ticket wurde erstellt")
          .setDescription(`Willkommen bei deinem Ticket ${interaction.user.username}\n Reagiere mit 🔒 um das Ticket zu schlieẞen.`)
          .setThumbnail(interaction.guild.iconURL())
          .setTimestamp()
          .setFooter({ text: `${interaction.guild.name}'s Tickets` })

        const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('closeticket')
              .setLabel('Ticket schlieẞen')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🔒')
          )
        await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })

        const openedTicket = new EmbedBuilder()
          .setDescription(`Ticket erstellt in <#${channel.id}>`)

        await interaction.reply({ embeds: [openedTicket], ephemeral: true })
      })
    }

    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
        .setDescription('🔒 Bist du Sicher das du dieses Ticket schlieẞen willst?')
        .setColor('Red')

      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('yesclose')
            .setLabel('Ja')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('✅'),

          new ButtonBuilder()
            .setCustomId('nodont')
            .setLabel('Nein')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('❌')
        )

      await interaction.reply({ embeds: [closingEmbed], components: [buttons] })
    }

    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `ticket-${interaction.user.username}.html`,
      });

      const transcriptEmbed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild.name}'s Transcripts`, iconURL: guild.iconURL() })
        .addFields(
          { name: `🔒 Geschlossen von`, value: `${interaction.user.tag}` }
        )
        .setColor('Red')
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: `${interaction.guild.name}'s Tickets` })

      const processEmbed = new EmbedBuilder()
        .setDescription(`✅ Das Ticket wird in 10 Sekunden geschlossen...`)
        .setColor('Red')

      await interaction.reply({ embeds: [processEmbed] })

      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });

      setTimeout(() => {
        interaction.channel.delete()
      }, 10000);
    }

    if (customId === "nodont") {
      const noEmbed = new EmbedBuilder()
        .setDescription('🔒 Das Schlieẞen des Tickets wurde abgebrochen.')
        .setColor('Red')

      await interaction.reply({ embeds: [noEmbed], ephemeral: true })
    }
  }
})


// Moderate User =======================================================================
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.guild) return;

  if (interaction.customId !== "Moderate") return;
  else {
    const string = await interaction.values.toString();

    if (string.includes('ban')) {
      const userid = await interaction.values[0].replace(/ban/g, '');
      const reason = `Moderiert von ${interaction.user.id}`;
      const ban = await interaction.guild.bans.create(userid, { reason }).catch(async err => {
        await interaction.reply({ content: `Ich konnte dieses Mitglied nicht bannen.`, ephemeral: true });
      });

      if (ban) interaction.reply({ content: `Ich habe${userid} vom Server gebannt.`, ephemeral: true });
    }

    if (string.includes('kick')) {
      const userId = await interaction.values[0].replace(/kick/g, '');
      const member = await interaction.guild.members.fetch(userId);
      const kick = await member.kick({ reason: `Moderiert von ${interaction.user.id}` }).catch(async err => {
        await interaction.reply({ content: 'Ich konnte dieses Mitglied nicht kicken', ephemeral: true });
      });

      if (kick) await interaction.reply({ content: `Ich habe${userId} vom Server gekickt.`, ephemeral: true });
    }
  }
})


// AutoThread System
const channelID = process.env.ChannelID;
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.channel.id !== channelID) return;

  const channel = message.channel;
  const threadParent = message;

  try {
    const thread = await channel.threads.create({
      name: `Eine Spielersuche wurde von ${message.author.username} erstellt`,
      autoArchiveDuration: 1440,
      reason: 'Create automatic threads',
      startMessage: threadParent
    });

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setDescription(`> Eine Spielersuche wurde von <@${message.author.id}> erstellt.`)
      .setTimestamp()
      .setFooter({
        text: `Threads werden automatisch erstellt`,
        iconURL: client.user.avatarURL()
      })

    const response = await thread.members.add(client.user.id);
    if (response) {
      const botMessage = await thread.send({ embeds: [embed] });
      console.log(`Bot embed message on channel: ${botMessage.content}`);
    }
  } catch (error) {
    console.error('Something went wrong:', error);
  }
})



// Modmail ===================================================================================
const ModmailData = require('./Schemas/modmailSchema'); // Path to your Modmail schema
const guildId = '1090278417213161632'; // your guildId, for the modmails
const modmailCategory = '1091720368319893664'; // The category where the modmail tickets should be created

const userIDs = ['453979243664113677']; // Users who should see the modmail tickets
const roleIDs = ['1090297213793620110', '1094295871803363410']; // Roles who should see the modmail tickets

client.on(Events.MessageCreate, async (message) => {

  const userId = message.author.id;
  const guild = client.guilds.cache.get(guildId);
  const UserMessage = message.content;

  if (message.author.bot) return;
  if (message.channel.type === ChannelType.DM) {

    try {

      const modmailData = await ModmailData.findOne({ userId: userId });
      const welcomeStatus = modmailData?.welcome ?? false;
      const modmailReason = modmailData?.issue ?? null;
      const modmailChannel = modmailData?.channel ?? null;

      if (welcomeStatus === false) {
        const welcomeEmbed = new EmbedBuilder()
          .setTitle('Willkommen')
          .setColor('Orange')
          .setDescription('**Willkommen bei unseren Modmail System**.\nWenn du unser Server-Team kontaktieren willst, dann teile uns bitte **dein Anliegen** in deiner nächsten Nachricht mit, oder **antworte** mit `cancel` um die Modmail **abzubrechen**.')
          .setThumbnail("https://cdn.discordapp.com/attachments/842303109463408641/1202017064038965308/584856ade0bb315b0f7675ab.png?ex=65cbeca0&is=65b977a0&hm=baf1ef0e74fca777611ded751eef14817348225bbbc4eda0ab0bf43058242c03&")
          .setImage("https://media.discordapp.net/attachments/842303109463408641/1202016581995987045/Titelloses_71_20240130232405.png?ex=65cbec2d&is=65b9772d&hm=e7a8e7d91ca89f915cbc98c5e9d3ca965a82ee922e72fe2ac95b3f5a3166608d&=&format=webp&quality=lossless&width=960&height=288")
          .setTimestamp();

        await message.channel.send({ embeds: [welcomeEmbed] });

        await ModmailData.updateOne(
          { userId: userId },
          { $set: { welcome: true } },
          { upsert: true }
        );

        return;
      };

      if (welcomeStatus === true) {
        if (!modmailReason) {

          if (UserMessage !== 'cancel') {

            await ModmailData.updateOne(
              { userId: userId },
              { $set: { issue: UserMessage } },
              { upsert: true }
            );

            const Category = await guild.channels.fetch(modmailCategory);

            const channel = await guild.channels.create({
              name: `${message.author.tag}`,
              type: ChannelType.GuildText,
              parent: Category,
            });

            await channel.permissionOverwrites.edit(guild.id, { ViewChannel: false });

            for (const userID of userIDs) {
              const user = await client.users.fetch(userID);
              await channel.permissionOverwrites.edit(user.id, {
                ViewChannel: true,
              });
            }

            for (const roleID of roleIDs) {
              const role = await guild.roles.fetch(roleID);
              await channel.permissionOverwrites.edit(role.id, {
                ViewChannel: true,
              });
            }


            await ModmailData.updateOne(
              { userId: userId },
              { $set: { channel: channel.id } },
              { upsert: true }
            );

            const startEmbed = new EmbedBuilder()
              .setTitle('Verbunden!')
              .setColor('Green')
              .setDescription('Du bist nun mit einem Teammitglied verbunden.')
              .setThumbnail("https://media.discordapp.net/attachments/842303109463408641/1202017593679171584/Eo_circle_green_checkmark.svg.png?ex=65cbed1e&is=65b9781e&hm=5098b2e0b25c6111ade470ac53a3b39089c4c63a8ddd5c42c300416557fca286&=&format=webp&quality=lossless&width=468&height=468")
              .setTimestamp();

            await message.channel.send({ embeds: [startEmbed] });

            const infoEmbed = new EmbedBuilder()
              .setTitle('Modmail')
              .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
              .setDescription(`${message.author} (${message.author.tag}) hat eine Modmail gestartet!\n\nDie Nachricht des Users: \`${UserMessage}\``)
              .setColor('Green')
              .setTimestamp();

            const infoMessage = await channel.send({ content: `<@&1090297213793620110>`, embeds: [infoEmbed] });
            await infoMessage.pin()
          } else {

            await ModmailData.deleteOne({ userId: userId });

            const cancelEmbed = new EmbedBuilder()
              .setTitle('Abgebrochen')
              .setColor('Red')
              .setDescription('Du hast die Modmail erfolgreich abgebrochen.')

            await message.channel.send({ embeds: [cancelEmbed] })
          };

          return;
        } else {

          const userChannel = await client.channels.fetch(modmailChannel);

          const embedMessage = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setDescription(message.content)
            .setTimestamp();

          try {
            await userChannel.send({ embeds: [embedMessage] });
            await message.react('✅');
          } catch (err) {
            console.log(`An error occurred while sending ${message.author.tag} modmail message.\nError:\n${err}`);
            await message.channel.send('An error occurred while sending your message.');
            await message.react('❌');
          }

          return;
        }
      }
    } catch (err) {
      await message.channel.send('An error occurred, please try again later.');
      console.log(`An error occurred while in chat with ${message.author.tag}\nError:\n${err}`);
      return;
    }
  };

  try {
    if (message.channel.type === ChannelType.GuildText) {

      const modmailServerData = await ModmailData.findOne({ channel: message.channel.id });
      const modmailUserId = modmailServerData?.userId ?? null;
      const modmailChannelId = modmailServerData?.channel ?? null;

      if (!modmailChannelId) return;

      const user = await client.users.fetch(modmailUserId);

      if (message.channel.id !== modmailChannelId) return;

      if (message.content === '!ping') {

        const wakeup = new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
          .setTitle('Erinnerung!')
          .setDescription('Bitte antworte dieser Modmail, oder Sie wird schon bald geschlossen.')
          .setThumbnail("https://media.discordapp.net/attachments/842303109463408641/1202018476546326528/22885.png?ex=65cbedf1&is=65b978f1&hm=8ffa01608e81110a299de88a071ad7e46b6b87636b020522aa894356f52be7b5&=&format=webp&quality=lossless&width=483&height=468")
          .setColor('Red')
          .setTimestamp();

        await user.send({ embeds: [wakeup] });
        wakeup.setDescription('Die Nachricht wurde zu den User gesendet!');
        await message.reply({ embeds: [wakeup] });
        return;
      } if (message.content === '!close') {
        const close = new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
          .setTitle('Geschlossen')
          .setColor('Red')
          .setDescription('The modmail is now closed. Delete the ticket with !delete')
          .setThumbnail("https://media.discordapp.net/attachments/842303109463408641/1202019289419493437/678129.png?ex=65cbeeb3&is=65b979b3&hm=a3113af89f131dff63de6ca4eac85a166b5201cef9497d4e7cd9464e4f43d10e&=&format=webp&quality=lossless&width=468&height=468")
          .setTimestamp();

        await message.reply({ embeds: [close] });
        close.setDescription('Die Modmail ist nun geschlossen.');
        await user.send({ embeds: [close] });
        return;
      } if (message.content === '!delete') {
        const deleteEmbed = new EmbedBuilder()
          .setTitle('Delete')
          .setDescription('Das Ticket wird in 5 Sekunden geschlossen.')
          .setColor('Red')
          .setTimestamp();

        await user.send({ embeds: [deleteEmbed] });
        await message.reply({ embeds: [deleteEmbed] });

        setTimeout(async () => {

          deleteEmbed.setDescription('Das Ticket ist nun geschlossen.');

          await message.channel.delete();

          await ModmailData.deleteOne({ userId: user.id });

          await user.send({ embeds: [deleteEmbed] });
        }, 5000);
      } else {
        const embedMessage = new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
          .setDescription(message.content)
          .setTimestamp();

        try {
          await user.send({ embeds: [embedMessage] });
          await message.react('✅');
        } catch (err) {
          await message.reply('An error occurred, please try again later.')
          await message.react('❌');
          console.log(`An error occurred while ${message.author.tag} trys to contact ${user.tag}\nError:\n${err}`);
        }
      }
    }
  } catch (err) {
    console.log(`An error occurred while sending modmail message to ${message.author.tag}\nError:\n${err}`);
    await message.reply('An error occurred while sending your message.');
    await message.react('❌');
  };
});




// Music ===================================================0

const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddListWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({
      embeds: [new EmbedBuilder().setColor("Green")
        .setDescription(`🎶 | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nHinzugefügt von: ${song.user
          }\n${status(queue)}`)]
    })
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      {
        embeds: [new EmbedBuilder().setColor("Green")
          .setDescription(`🎶 | ${song.name} - \`${song.formattedDuration}\` wurde von ${song.user} zur Playlist hinzugefügt`)]
      }
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      {
        embeds: [new EmbedBuilder().setColor("Green")
          .setDescription(`🎶 | Added \`${playlist.name}\` playlist (${playlist.songs.length
            } songs) to queue\n${status(queue)}`)]
      }
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`⛔ | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send({
    embeds: [new EmbedBuilder().setColor("Red")
      .setDescription('⛔ |Voice channel is empty! Leaving the channel...')]
  }))
  .on('searchNoResult', (message, query) =>
    message.channel.send(
      {
        embeds: [new EmbedBuilder().setColor("Red")
          .setDescription('`⛔ | Ich konnte \`${query}\`!` nicht finden')]
      })
  )
  .on('finish', queue => queue.textChannel.send({
    embeds: [new EmbedBuilder().setColor("Green")
      .setDescription('🏁 | Warteschlange beendet!')]
  }))




// Chat GPT ========================================

const { OpenAI } = require("openai");

const IGNORE_PREFIX = "!";
const CHANNELS = ["1207299490323894272"];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(IGNORE_PREFIX)) return;
  if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id))
    return;

  await message.channel.sendTyping();

  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5000);

  let conversation = [];
  conversation.push({
    role: "system",
    content: "Chat GPT ist ein freundlicher Chatbot."
  });

  let prevMessages = await message.channel.messages.fetch({ limit: 10 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (msg.author.bot && msg.author.id !== client.user.id) return;
    if (msg.content.startsWith(IGNORE_PREFIX)) return;

    const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

    if (msg.author.id === client.user.id) {
      conversation.push({
        role: "assistant",
        name: username,
        content: msg.content,
      });

      return;
    }

    conversation.push({
      role: "user",
      name: username,
      content: msg.content,
    });
  })

  const response = await openai.chat.completions
    .create({

      model: "gpt-3.5-turbo",
      messages: conversation,
    })
    .catch((error) => console.error(`OpenAI Error:\n`, error));

  clearInterval(sendTypingInterval);

  if (!response) {
    message.reply("Es scheint zurzeit Probleme mit der OpenAI API zu geben, versuche es später nochmal.");
    return;
  }

  const responseMessage = response.choices[0].message.content;
  const chunkSizeLimit = 2000;

  for (let i = 0; i < responseMessage.length; i += chunkSizeLimit) {
    const chunk = responseMessage.substring(i, i + chunkSizeLimit);


    await message.reply(chunk);
  }

});
