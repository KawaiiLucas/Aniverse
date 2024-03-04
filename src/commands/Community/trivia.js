const { Trivia } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Spiele eine Runde Trivia'),
    async execute (interaction) {
        const Game = new Trivia({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Trivia',
                color: '#4dff00',
                description: 'Du hast 60 Sekunden um die Antwort zu erraten.',
            },

            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            trueButtonStyle: 'SUCCESS',
            falseButtonStyle: 'DANGER',
            mode: 'multiple', //multiple or single
            difficulty: 'medium',
            winMessage: 'Du hast gewonnen! Die richtige Antwort war {answer}',
            loseMessage: 'Du hast verloren! Die richtige Antwort war {answer}',
            errMessage: 'Unable to fetch questions.',
            playerOnlyMessage: 'Nur {player} kann diese Buttons benutzen.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}