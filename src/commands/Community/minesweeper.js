const { Minesweeper } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('minesweeper')
    .setDescription('Spiele eine Runde Minesweeper.'),
    async execute (interaction) {
        const Game = new Minesweeper({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Minesweeper',
                color: '#4dff00',
                description: 'Click on the buttons to reveal the blocks except mines.'
            },

            emojis: { flag: '🚩', mine: '💣' },
            mines: 5,
            timeoutTime: 60000,
            winMessage: 'Du hast das Spiel gewonnen!',
            loseMessage: 'Du hast das Spiel leider verloren.',
            playerOnlyMessage: 'Nur {player} kann diese Buttons benutzen.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}