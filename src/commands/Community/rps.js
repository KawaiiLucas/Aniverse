const { SlashCommandBuilder } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Spiele Schere-Stein-Papier mit einem Mitglied')
    .addUserOption(option => option.setName('gegner').setDescription('Gegen wen du spielen willst').setRequired(true)),
    async execute (interaction) {

        const { options } = interaction;
        const gegner = interaction.options.getUser('gegner');

        const Game = new RockPaperScissors({
            message: interaction,
            isSlashGame: true,
            opponent: gegner,
            embed: {
                title: 'Schere Stein Papier',
                color: '#ff0000',
                description: 'Drücke auf einen Button um deine Auswahl zu treffen.'
            },
            buttons: {
                rock: 'Rock',
                paper: 'Paper',
                scissors: 'Scissors'
            },
            emojis: {
                rock: '🪨',
                paper: '📰',
                scissors: '✂️'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            pickMessage: 'Du hast {emoji} gewählt.',
            winMessage: '**{player}** hat das Spiel gewonnen!',
            tieMessage: 'Ergebnis: Unentschieden',
            timeoutMessage: 'Die Zeit zum Reagieren ist abgelaufen. Ergebnis: Unentschieden',
            playerOnlyMessage: 'Nur {player} und {opponent} können die Buttons benutzen.'
        });

        Game.startGame();
    }
}