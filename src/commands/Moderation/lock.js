const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
//const config = require("../../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Sperre einen Channel für eine bestimmte Rolle.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option.setName('channel').setDescription('Der Channel der gesperrt werden soll').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Die Rolle welche für den Channel gesperrt werden soll').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    const errEmbed = new EmbedBuilder()
      .setTitle('ERROR')
      .setColor('Red')
      .setDescription('Missing Permissions: Manage Channels');

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ embeds: [errEmbed] });

    channel.permissionOverwrites.create(role, { SendMessages: false });

    const embed = new EmbedBuilder()
      .setTitle('🔒 ・ Channel Locked')
      .setDescription(`:white_check_mark: ${channel} wurde gesperrt.`)
      .addFields(
        { name: '🔒 Gesperrt für:', value: `${role}`, inline: false },
        { name: '⏲️ Time:', value: `${new Date().toLocaleString()}`, inline: false },
        { name: '🔒 Geschlossen von:', value: `<@${interaction.user.id}>`, inline: false },
      )
      .setColor('Red')
      .setTimestamp()
      //.setFooter({ text: `Bot was made by Astro Studios `, iconURL: config.Infos.BotPFP });

    await interaction.reply({ embeds: [embed] });
  },
};