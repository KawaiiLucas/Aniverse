const { Slots } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Spiele eine Runde Slots'),
    async execute (interaction) {
        const Game = new Slots({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Slot Machine',
                color: '#4dff00'
            },
            slots: ['🍇', '🍊', '🍋', '🍌'],
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}