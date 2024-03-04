const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('text-sumarize')
    .setDescription('Lasse deinen Text verkürzen')
    .addStringOption(option => option.setName('text').setDescription('Den Text den du verkürzen möchtest').setRequired(true)),
    async execute (interaction) {

        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const text = options.getString('text');

        const input = {
            method: 'POST',
            url: 'https://gpt-summarization.p.rapidapi.com/summarize',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'ebce618c6fmshae1776d6df73c6cp10309bjsn7578d57c806d',
                'X-RapidAPI-Host': 'gpt-summarization.p.rapidapi.com'
            },
            data: {
                text: text,
                num_sentences: 3
            }
        };

        try {
            const output = await axios.request(input);

            const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(output.data.summary)

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: `Es ist ein Fehler aufgetreten, versuche es später erneut.` });
        }
    }
}