const { MatchPairs } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('matchpairs')
    .setDescription('Spiele eine Runde Matchpairs.'),
    async execute (interaction) {
        const Game = new MatchPairs({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Match Pairs',
                color: '#4dff00',
                description: 'Click on the buttons to match emojis with their paris'
            },

            emojis: ['🍉', '🍇', '🍊', '🍋', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
            timeoutTime: 60000,
            winMessage: 'Du hast das Spiel gewonnen! du hast insgesamt `{titleTurned}` aufgedeckt.',
            loseMessage: 'Du hast das Spiel leider verloren.',
            playerOnlyMessage: 'Nur {player} kann diese Buttons benutzen.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}