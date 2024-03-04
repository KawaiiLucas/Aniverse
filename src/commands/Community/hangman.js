const { SlashCommandBuilder } = require("discord.js");
const { Hangman } = require("discord-gamecord");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Spiele ein Hangman Game'),
    async execute (interaction) {

        const Game = new Hangman({
            message: interaction,
            embed: {
                title: 'Hangman',
                color: '#007bff'
            },
            hangman: {hat: '🎩', head: '😟', shirt: '👕', pants: '👖', boots: '👞👞'},
            timeoutTime: 60000,
            timeWords: 'all',
            winMessage: "Du hast gewonnen! das Wort war **{word}**",
            loseMessage: "Du hast verloren! das Wort war **{word}**",
            playerOnlyMessage: 'Nur {player} kann diese Buttons benutzen',
        })

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}