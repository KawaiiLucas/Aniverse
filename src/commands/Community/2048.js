const { TwoZeroFourEight } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('2048')
    .setDescription('Spiele eine Runde 2048'),
    async execute (interaction) {
        const Game = new TwoZeroFourEight({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: '2048',
                color: '#4dff00'
            },

            emojis: {
                up: '⬆',
                down: '⬇',
                left: '⬅',
                right: '➡',
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            playerOnlyMessage: 'Only {play} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}