const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Lässt dir Informationen über ein Mitglied anzeigen.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Das Mitglied dessen Informationen du haben möchtest.")
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser("user") || interaction.user;
      const member = await interaction.guild.members.fetch(user.id);
      const icon = user.displayAvatarURL();
      const tag = user.tag;

      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Informationen`)
        .setColor("Red")
        .setThumbnail(icon)
        .setTimestamp()
        .setFooter({ text: `User ID: ${user.id}`, iconURL: icon })
        .setAuthor({ name: tag, iconURL: icon })
        .addFields({
          name: `Discord Account erstellt am`,
          value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`,
          inline: true,
        })
        .addFields({
          name: `Server beigetreten am`,
          value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
          inline: true,
        })
        .addFields({
          name: `Boosted Server`,
          value: member.premiumSince ? "✅ Ja" : "❌ Nein",
          inline: false,
        });

      await interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Es ist ein Error aufgetreten (user-info)",
        ephemeral: true,
      });
    }
  },
};
