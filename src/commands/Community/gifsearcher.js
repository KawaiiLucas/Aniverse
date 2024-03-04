const { SlashCommandBuilder } = require('discord.js');
const superagent = require('superagent');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gifsearch')
    .setDescription('Sucht ein GIF')
    .addStringOption(option => option.setName('query').setDescription('Wonach möchtest du suchen?').setRequired(true)),
    async execute (interaction) {

        await interaction.deferReply();

        const { options } = interaction;
        const query = options.getString('query');
        const key = 'AIzaSyC503aEk4UDEdqPi84yvmUP2Ek4jcULDKg';
        const clientkey = 'MyProject';
        const lmt = 8;

        let choice = Math.floor(Math.random() * lmt);

        const link = 'https://tenor.googleapis.com/v2/search?q=' + query + '&key=' + key + '&client_key=' + clientkey + '&limit=' + lmt;

        const output = await superagent.get(link).catch(err => {});

        try {
            await interaction.editReply({ content: output.body.results[choice].itemurl });
        } catch (e) {
            return await interaction.editReply({ content: `❌ Ich konnte kein passendes GIF finden für \`${query}\`!` });
        }
    }
}