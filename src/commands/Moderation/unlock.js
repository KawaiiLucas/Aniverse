const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
//const config = require("../../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Entsperre einen Channel für eine bestimmte Rolle')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option.setName('channel').setDescription('Den Channel der entsperrt werden soll').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Die Rolle die für den Channel entsperrt werden soll').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    channel.permissionOverwrites.create(role.id, { SendMessages: true });

    const embed = new EmbedBuilder()
      .setTitle('🔒 ・ Channel Unlocked')
      .setDescription(`:white_check_mark: ${channel} wurde entsperrt für die ${role} Rolle.`)
      .addFields(
        { name: '🔒 Entsperrt für:', value: `${role}`, inline: false },
        { name: '⏲️ Time:', value: `${new Date().toLocaleString()}`, inline: false },
        { name: '🔒 Entsperrt von:', value: `<@${interaction.user.id}>`, inline: false },
      )
      .setColor('Green')
      .setTimestamp()
    //  .setFooter({ text: `Bot was made by Astro Studios `, iconURL: config.Infos.BotPFP });

    await interaction.reply({ embeds: [embed] });
  },
};
