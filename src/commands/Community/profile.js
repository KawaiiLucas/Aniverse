const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
require('dotenv').config()
let db;
let collection;
let collection2;
(async () => {
  try {
    const mongoClient = new MongoClient(process.env.mongoURL);
    await mongoClient.connect();
    db = mongoClient.db('xpbot');
    collection = db.collection('userProfil');
    collection2 = db.collection('userXp');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();


module.exports = {
  data: new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Profil Ansehen')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der User von dem du das Profil sehen möchtest.')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.guild) return;
    if (interaction.commandName === 'profil') {
      const user = interaction.options.getUser('user')
      let userXpData = await collection2.findOne({ guildId: interaction.guild.id, userId: user.id });

      if (!userXpData) {
        userXpData = {
          guildId: interaction.guild.id,
          userId: user.id,
          xp: 0,
          level: 0
        };
        await collection2.insertOne(userXpData);
      }
      const curXp = userXpData.xp;
      const curLvl = userXpData.level;

       let userProfilData = await collection.findOne({ guildId: interaction.guild.id, userId: user.id });

        if (!userProfilData) {
            await interaction.reply({content: 'Dieser User hat kein Profil', ephemeral: true})
            return
        }

      const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle(userProfilData.name+`'s Profil`)
      .setDescription(`> **Name:** ${userProfilData.name}\n > **Alter:** ${userProfilData.alter} \n > **Geburtsdatum:** ${userProfilData.geburtsdatum} \n > **Hobbies:** ${userProfilData.hobbies} \n\r **Level:** \`${curLvl}\` \n **XP:** \`${curXp}\``)
      .setThumbnail(user.avatarURL())
      .setImage('https://media.discordapp.net/attachments/1184440284264804442/1192167909691232366/Titelloses_67_20240103190931.png?ex=65a817e3&is=6595a2e3&hm=4c097e1b4c650212163f17fcd6c8594fcbc110cbc4d062b569b7183741841a04&=&format=webp&quality=lossless')
    
      await interaction.reply({embeds: [embed]})
      
    }
  },
}
