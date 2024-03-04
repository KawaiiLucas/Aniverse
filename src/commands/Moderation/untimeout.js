const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Entfernt ein Timeout von einem Mitglied.')
    .addUserOption(option => option.setName('target').setDescription('The user you would like to untimeout').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for untiming out the user').setRequired(false)),
    async execute(interaction, message, client) {
 
        const timeUser = interaction.options.getUser('target');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        const user = interaction.options.getUser('user') || interaction.user;
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({ content: "You do not have permission to run this command", ephemeral: true})
        if (!timeMember.kickable) return interaction.reply({ content: 'I cannot timeout this user! This is either because their higher then me or you.', ephemeral: true})
        if (interaction.member.id === timeMember.id) return interaction.reply({content: "You cannot timeout yourself!", ephemeral: true})
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({content: "You cannot untimeout staff members or people with the Administrator permission!", ephemeral: true})
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given."
 
        await timeMember.timeout(null, reason)
 
            const minEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Mitglied's Timeout wurde entfernt`)
            .setDescription(`${timeUser.tag}'s Timeout wurde **entfernt** von ${user.tag} \n \n **Reason:** ${reason}`)
            .setFooter({ text: `User: ${user.tag}`})
            .setTimestamp()
 
            const dmEmbed = new EmbedBuilder()
            .setTitle('Dein Timeout wurde entfernt')
            .setDescription(`Dein Timeout wurde **entfernt** in ${interaction.guild.name} \n \n **Reason:** ${reason}`)
            .setColor('Blue')
            .setTimestamp()
 
 
            await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
 
            await interaction.reply({ embeds: [minEmbed] })
 
 
 
    },
}