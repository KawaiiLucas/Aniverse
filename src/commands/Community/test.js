const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Das ist der Test Command"),
  async execute(interaction, client) {
    await interaction.reply({ content: "Der Bot funktioniert" });
  }
}