const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios');

module.exports ={
    data: new SlashCommandBuilder()
    .setName('random-quote')
    .setDescription('Schickt einen zufälligen Spruch'),
    async execute (interaction) {

        await interaction.deferReply({ ephemeral: false });

        const input = {
            method: 'GET',
            url: 'https://quotes15.p.rapidapi.com/quotes/random/',
            headers: {
                'X-RapidAPI-Key': 'ebce618c6fmshae1776d6df73c6cp10309bjsn7578d57c806d',
                'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
            }
        };

        try {
            const output = await axios.request(input);

            const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`${output.data.content} - **${output.data.originator.name}**`)

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'Es ist ein Fehler aufgetreten, versuche es später erneut.'});
        }
    }
}