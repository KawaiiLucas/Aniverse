const { Interaction, Button } = require("discord.js");
const voiceButtons = require('../other/voiceButtons')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton() || interaction.isModalSubmit()) {
            voiceButtons(interaction)
        }
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

    },
    


};