const { TicTacToe } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('tic-tac-toe')
    .setDescription('Spiele eine Runde Tic-Tac-Toe')
    .addUserOption(option => option.setName('user').setDescription('Mit wem willst du spielen?').setRequired(true)),
    async execute (interaction) {
        const Game = new TicTacToe({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('user'),
            embed: {
                title: 'Tic Tac Toe',
                color: '#4dff00',
                statusTitle: 'Status',
                overTitle: 'Game Over'
            },

            emojis: {
                xButton: '❌',
                oButton: '🔵',
                blankButton: '➖',
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: '{emoji} | **{player}** ist dran',
            winMessage: '{emoji} | **{player}** hat das Spiel gewonnen.',
            tieMessage: 'Das Ergebnis ist. Unentschieden.',
            timeoutMessage: 'Niemand hat das Spiel gewonnen.',
            playerOnlyMessage: 'Nur {player} und {opponent} können die Buttons benutzen.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}