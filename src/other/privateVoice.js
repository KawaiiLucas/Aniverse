const { Interaction, ActionRowBuilder, ButtonStyle, ButtonBuilder,PermissionsBitField, EmbedBuilder,ChannelType, PermissionFlagsBits, Message } = require("discord.js");
const config = require('../config.json')
const { MongoClient } = require('mongodb');
require('dotenv').config()
let db;
let collection;
(async () => {
    try {
      const mongoClient = new MongoClient(process.env.mongoURL);
      await mongoClient.connect();
      db = mongoClient.db('xpbot');
      pChannels = db.collection('pChannels');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  })();
module.exports =  async function(oldState, newState, client){
    try {
        if (config.VoiceManage.includes(newState.channelId)) {
            var channelId = newState.channelId
          }
        
          const guild = newState.guild;
          privateChannel = await pChannels.findOne({ guildId: guild.id, channelId: newState.channelId });
        
        
          if (newState.channelId === channelId) {
        
            const user = newState.member;
            const channelName = client.guilds.cache.get(config.serverid).channels.cache.get(channelId).name
        
        
        
            const newChannel = await guild.channels.create({
              name: `🔊 ${user.user.username}`,
              type: ChannelType.GuildVoice,
              parent: config.PrivateChannelCategory,
        
            });
        
            newChannel.permissionOverwrites.set([{
              id: user.id,
              allow: [PermissionsBitField.Flags.ManageChannels],
            },]);
        
            if (!privateChannel) {
              privateChannel = {
                guildId: guild.id,
                channelId: newChannel.id,
                owner: user.id,
              };
              await pChannels.insertOne(privateChannel);
            }
        
            await user.voice.setChannel(newChannel);
        
        
        
            const one = new ButtonBuilder()
              .setEmoji('🔓')
              .setCustomId(`unlock`)
              .setLabel('Channel entsperren')
              .setStyle(ButtonStyle.Primary);
            const two = new ButtonBuilder()
              .setEmoji('🔒')
              .setCustomId(`lock`)
              .setLabel('Channel sperren')
              .setStyle(ButtonStyle.Danger);
            const three = new ButtonBuilder()
              .setEmoji('⛔')
              .setCustomId(`limit`)
              .setLabel('Benutzerlimit')
              .setStyle(ButtonStyle.Secondary);
            const four = new ButtonBuilder()
              .setEmoji('🗝️')
              .setCustomId(`owner`)
              .setLabel('Rechte übergeben')
              .setStyle(ButtonStyle.Success);
            const five = new ButtonBuilder()
              .setEmoji('✅')
              .setCustomId(`kick`)
              .setLabel('User kicken')
              .setStyle(ButtonStyle.Danger);
        
        
            const row = new ActionRowBuilder()
              .addComponents(one, two, three, four, five);
        
            const embed = new EmbedBuilder()
              .setTitle("🔊 Voicechat verwalten")
              .setDescription(`<@${user.id}> Du hast deinen eigenen Channel erstellt! \n Hier sind einige Optionen womit du deinen Voicechat verwalten kannst.`)
              .setThumbnail('https://media.discordapp.net/attachments/1184440284264804442/1192814797994074203/speaker-xxl-removebg-preview.png?ex=65aa7259&is=6597fd59&hm=d9ebe05b987c2efc1760ece54d42d552c2e381fc415a407367957f3df9abd7ac&=&format=webp&quality=lossless')
              .setImage('https://cdn.discordapp.com/attachments/1184440284264804442/1192810767758667796/Titelloses_67_20240105134117.png?ex=65aa6e98&is=6597f998&hm=4b54e721441d9d4e1a4d8165d741bb62a434e969b49c8be18a9498b4ec83b188&')
              .setColor('Orange')
        
            const privateMessage = newChannel
            await privateMessage.send({
              content: `<@${user.id}>`,
              embeds: [embed],
              components: [row]
            });
            await pChannels.updateOne({ guildId: guild.id, channelId: newChannel.id }, { $set: { owner: user.id } });
        
          } else if (oldState.channelId !== null && oldState.channel.members.size === 0 && oldState.channelId !== channelId && oldState.channel.parentId === config.PrivateChannelCategory && oldState.channelId !== config.VoiceManage) {
            const channel = oldState.channel;
        
            if (oldState.channelId === config.VoiceManage[0]) return;
            try {
              await pChannels.deleteOne({ channelId: channel.id });
              await channel.delete();
        
        
        
        
            } catch (error) {
        
            }
          }
    } catch (error) {
        console.error('Error handlich Private Voice:', error);
    }
};