const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Times out a server member.')
    .addUserOption(option => option.setName('target').setDescription('The user you would like to time out').setRequired(true))
    .addStringOption(option => option.setName('duration').setRequired(true).setDescription('The duration of the timeout')
    .addChoices(
    { name: '60 Secs', value: '60'},
    { name: '2 Minutes', value: '120'},
    { name: '5 Minutes', value: '300'},
    { name: '10 Minutes', value: '600'},
    { name: '15 Minutes', value: '900'},
    { name: '20 Minutes', value: '1200'},
    { name: '30 Minutes', value: '1800'},
    { name: '45 Minutes', value: '2700'},
    { name: '1 Hour', value: '3600'},
    { name: '2 Hours', value: '7200'},
    { name: '3 Hours', value: '10800'},
    { name: '5 Hours', value: '18000'},
    { name: '10 Hours', value: '36000'},
    { name: '1 Day', value: '86400'},
    { name: '2 Days', value: '172800'},
    { name: '3 Days', value: '259200'},
    { name: '5 Days', value: '432000'},
    { name: 'One Week', value: '604800'} ))
    .addStringOption(option => option.setName('reason').setDescription('The reason for timing out the user').setRequired(true)),
    async execute(interaction, message, client) {
 
        const timeUser = interaction.options.getUser('target');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        const channel = interaction.channel;
        const duration = interaction.options.getString('duration');
        const user = interaction.options.getUser('user') || interaction.user;
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "You do not have permission to run this command", ephemeral: true})
        if (!timeMember) return await interaction.reply({ content: 'The user mentioned is no longer within the server.', ephemeral: true})
        if (!timeMember.kickable) return interaction.reply({ content: 'I cannot timeout this user! This is either because their higher then me or you.', ephemeral: true})
        if (!duration) return interaction.reply({content: 'You must set a valid duration for the timeout', ephemeral: true})
        if (interaction.member.id === timeMember.id) return interaction.reply({content: "You cannot timeout yourself!", ephemeral: true})
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({content: "You cannot timeout staff members or people with the Administrator permission!", ephemeral: true})
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "Kein Grund angegeben."
 
        await timeMember.timeout(duration * 1000, reason)
 
            const minEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Mitglied Stummgeschaltet`)
            .setDescription(`**${timeUser.tag}** wurde **stummgeschalten** für **${duration / 60}** Minuten in ${interaction.guild.name} \n \n **Reason:** ${reason}`)
            .setFooter({ text: `User: ${user.tag}`})
            .setTimestamp()
 
 
            const dmEmbed = new EmbedBuilder()
            .setTitle('Du wurdest stummgeschalten')
            .setDescription(`Du hast ein Timeout in **${interaction.guild.name}** für **${duration / 60}** Minuten erhalten. \n \n **Reason:** ${reason}`)
            .setColor('Blue')
            .setTimestamp()
 
            await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
 
            await interaction.reply({ embeds: [minEmbed] })
 
 
 
    },
}