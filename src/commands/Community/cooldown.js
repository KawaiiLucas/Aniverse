const { SlashCommandBuilder, time } = require("discord.js");

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cooldown')
    .setDescription('Command cooldown'),
    async execute (interaction) {

        if (timeout.includes(interaction.user.id)) return interaction.reply({ content: 'Du hast einen Cooldown, versuche es in einer Minute nocheinmal', ephemeral: true });

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 1000)
    }
}