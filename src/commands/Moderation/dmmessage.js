const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Sendet eine DM an ein Mitglied.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => option.setName('target').setDescription('Welchem Member du schreiben möchtest').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Den Text welchen sie erhalten sollen').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Der Grund für die Nachricht.').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') || 'Kein Grund angegeben';
    const message = interaction.options.getString('message');
    const guildName = interaction.guild.name;

    const targetEmbed = new EmbedBuilder()
      .setTitle(':red_circle: ・ Staff Message')
      .setDescription(`Eine persönliche Nachricht von unserem Server!\n Message: ${message}`)
      .addFields(
        { name: ':pushpin: Absender', value: `<@${interaction.user.id}>`, inline: false },
        { name: ':revolving_hearts: Server', value: `**${guildName}**`, inline: false },
        { name: ':question: Grund', value: `${reason}`, inline: false },
        { name: '⏲️ Zeit:', value: `${new Date().toLocaleString()}`, inline: false },
      )
      .setColor('Red')
      .setTimestamp()
      .setFooter({ text: `DM-System `, iconURL: 'https://images-ext-1.discordapp.net/external/5ip-H2dWhemp3IDf-uf0kGE9lTT2mYU42FPvKqH_Ums/https/cdn-longterm.mee6.xyz/plugins/embeds/images/1090278417213161632/c6642d4d1bd55da37c99c9ed5daa756c67f90d093decc51968b30ec9b72de39f.png?format=webp&quality=lossless&width=468&height=468' });

    try {
      await target.send({ embeds: [targetEmbed] });
    } catch (error) {
      // Send an ephemeral message instead of logging the error to the console
      await interaction.channel.send({
        content: 'Failed to DM the target user, either their DM is closed or they blocked me.',
        ephemeral: true,
      });
    }
  },
};