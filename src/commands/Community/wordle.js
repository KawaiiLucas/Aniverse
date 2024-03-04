const { Wordle } = require("discord-gamecord");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Spiele ein Wordle Game'),
    async execute (interaction) {

        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Wordle',
                color: '#007bff'
            },
            customWords: null,
            timeoutTime: 60000,
            winMessage: 'Du hast gewonnen! das Wort war **{word}**',
            loseMessage: 'Du hast verloren! das Wort war **{word}**',
            playerOnlyMessage: 'Nur {player} kann diese Buttons benutzen'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        })
    }    
}