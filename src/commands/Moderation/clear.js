const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Löscht eine spezifische Anzahl an Nachrichten")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Anzahl der Nachrichten die du löschen möchtest")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger("amount");
    const channel = interaction.channel;

    if (!interaction.member.permissions.has(PermissionsBitField.ManageMessages))
      return await interaction.reply({
        content:
          "Du hast nicht die Berechtigung um diesen Command auszuführen.",
        ephemeral: true,
      });
    if (!amount)
      return await interaction.reply({
        content: "Bitte gib eine Anzahl an Nachrichten ein.",
        ephemeral: true,
      });
    if (amount > 100 || amount < 1)
      return await interaction.reply({
        content: "Bitte gib eine Zahl zwischen **1** und **100** ein.",
        ephemeral: true,
      });

    await interaction.channel.bulkDelete(amount).catch((err) => {
      return;
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `:white_check_mark: **${amount}** Nachrichten wurden gelöscht.`
      );

    await interaction.reply({ embeds: [embed] }).catch((err) => {
      return;
    });
  },
};
