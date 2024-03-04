const { Interaction, EmbedBuilder, PermissionFlagsBits, Message } = require("discord.js");
const config = require('../config.json')
module.exports =  async function(message){
    if (message.author.bot) return;
    if (!message.guild) return;
    try {
        if (message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.KickMembers) || message.member.permissions.has(PermissionFlagsBits.BanMembers)) return
        if (config["Bad-Words"].words.some(word => message.content.toLowerCase().includes(word))) {
            if (message.deletable()) {
                message.delete()
            }
        }
    } catch (error) {
        console.error('Error handlich Bad Words:', error);
    }
};