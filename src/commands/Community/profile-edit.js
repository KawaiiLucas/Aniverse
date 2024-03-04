const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
require('dotenv').config()
let db;
let collection;
(async () => {
  try {
    const mongoClient = new MongoClient(process.env.mongoURL);
    await mongoClient.connect();
    db = mongoClient.db('xpbot');
    collection = db.collection('userProfil');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile-edit')
    .setDescription('Profil bearbeiten')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Dein Name')
        .setMaxLength(2000)
        .setRequired(false))
    .addStringOption(option =>
      option.setName('alter')
        .setDescription('Dein Alter')
        .setMaxLength(2000)
        .setRequired(false))
    .addStringOption(option =>
      option.setName('geburtsdatum')
        .setDescription('Dein Geburtstag')
        .setMaxLength(2000)
        .setRequired(false))
    .addStringOption(option =>
      option.setName('hobbies')
        .setDescription('Deine Hobbies und Interessen')
        .setMaxLength(2000)
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.guild) return;
    if (interaction.commandName === 'profile-edit') {
      let userProfilData = await collection.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
      if (!userProfilData) {
        userProfilData = {
          guildId: interaction.guild.id,
          userId: interaction.user.id,
          name: 'Kein Name angegeben',
          alter: 'Kein Alter angegeben',
          geburtsdatum: 'Kein Geburtsdatum angegeben',
          hobbies: 'Keine Hobbies angegeben'
        };
        await collection.insertOne(userProfilData);
      }
       const name = interaction.options.getString('name') ?? userProfilData.name ?? 'Kein Name angegeben'
       const alter = interaction.options.getString('alter') ?? userProfilData.alter ?? 'Kein Alter angegeben'
       const geburtsdatum = interaction.options.getString('geburtsdatum') ?? userProfilData.geburtsdatum ?? 'Kein Geburtsdatum angegeben'
       const hobbies = interaction.options.getString('hobbies') ?? userProfilData.hobbies ?? 'Keine Hobbies angegeben'

      const embed = new EmbedBuilder()
      .setTitle(interaction.user.displayName+`'s Profil`)
      .setDescription(`> **Name:** ${name}\n > **Alter:** ${alter} \n > **Geburtsdatum:** ${geburtsdatum} \n > **Hobbies:** ${hobbies}`)
      .setThumbnail(interaction.user.avatarURL())
      .setFooter({ text: 'Saved! ✔️' });
      await collection.updateOne({ guildId: interaction.guild.id, userId: interaction.user.id }, { $set: { name: name, alter: alter, geburtsdatum: geburtsdatum,hobbies: hobbies  } });
      await interaction.reply({embeds: [embed], ephemeral: true})
      
    }
  },
}
