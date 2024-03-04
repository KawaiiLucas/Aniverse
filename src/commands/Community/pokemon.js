const { GuessThePokemon } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('pokemon')
    .setDescription('Spiele eine Runde Errate das Pokemon.'),
    async execute (interaction) {
        const Game = new GuessThePokemon({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Errate das Pokemon',
                color: '#4dff00',
            },

            timeoutTime: 60000,
            winMessage: 'Du hast das Pokemon erraten! Es war {pokemon}',
            loseMessage: 'Das war leider falsch! Es war {pokemon}',
            errMessage: 'Unable to fetch pokemon.',
            playerOnlyMessage: 'Nur {player} kann diese Buttons benutzen.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}