const { Interaction, EmbedBuilder, Message } = require("discord.js");
const privateVoice = require("../other/privateVoice");


module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        try {
            privateVoice(oldState, newState, client)
        } catch (error) {
            console.error('Error handling VoiceState:', error);
        }

    },



};