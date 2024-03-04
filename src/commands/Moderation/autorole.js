const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription('Gibt allen Mitgliedern eine Rolle')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Die Rolle die jedes Mitglied erhalten soll.')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Check if user has the MANAGE_ROLES permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.MANAGE_ROLES)) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Du hast nicht die Berechtigungen um diesen Befehl auszuführen.');

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Get the role option from the user's input
        const role = interaction.options.getRole('role');

        // Get all members in the server
        const members = await interaction.guild.members.fetch();

        // Give the role to all members
        members.forEach(member => {
            if (!member.roles.cache.has(role.id)) {
                member.roles.add(role);
            }
        });

        // Send a success message
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`Die "${role.name}" Rolle wurde erfolgreich allen Mitgliedern gegeben.`);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
