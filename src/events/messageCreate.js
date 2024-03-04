const { Interaction, EmbedBuilder, Message } = require("discord.js");
var badwords = require('../other/badwords')
var XP = require('../other/XP')
const config = require('../config.json')


module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        if (!message.guild) return;
            try {
                XP(message)
                if (config.BadWords) {
                    badwords(message)
                }
              } catch (error) {
                console.error('Error handling user XP:', error);
              }

    },
    


};