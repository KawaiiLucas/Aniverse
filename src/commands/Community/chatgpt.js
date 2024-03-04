const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Chatte mit GPT-3')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Deine Nachricht an GPT-3')
                .setRequired(true)
        ),
    async execute(interaction) {
      
        await interaction.deferReply();

        
        const message = interaction.options.getString('message');

        
        const apiUrl = `https://api.artix.cloud/api/v1/AI/Chatgpt?q=${encodeURIComponent(message)}`;

        try {
            
            const response = await axios.get(apiUrl);

            
            if (response.status === 200) {
                const chatData = response.data.chat; 

                
                const embed = {
                    color: 0xff9c1c,
                    title: 'Chatte mit GPT-3',
                    description: chatData,
                };

                await interaction.followUp({ embeds: [embed] });
            } else {
                await interaction.followUp('An error occurred while fetching chat data.');
            }
        } catch (error) {
            console.error(error);
            await interaction.followUp('An error occurred while processing your request.');
        }
    },
};