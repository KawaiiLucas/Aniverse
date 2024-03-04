const { Snake } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('snake')
    .setDescription('Spiele eine Runde Snake'),
    async execute (interaction) {
        const Game = new Snake({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Snake Spiel',
                overTitle: 'Game Over',
                color: '#4dff00'
            },
            emojis: {
                board: '⬛',
                food: '🍎',
                up: '⬆',
                down: '⬇',
                left: '⬅',
                right: '➡',
            },
            stopButton: 'Stop',
            timeoutTime: 60000,
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
            foods: ['🍎', '🍇', '🍊', '🍉', '🥝', '🌽'],
            playerOnlyMessage: 'Only {player} can use these buttons.'



        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}