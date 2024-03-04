const { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Moderate')
    .setType(ApplicationCommandType.User),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'Du hast nicht die Berechtigungen um diesen Befehl auszuführen.', ephemeral: true });

        const user = await interaction.guild.members.fetch(interaction.targetId);

        const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('Moderate')
            .setMinValues(1)
            .setMaxValues(2)
            .setPlaceholder('Nichts ausgewhält...')
            .addOptions(
                {
                    label: 'Ban',
                    description: 'Bannt ein Mitglied vom Server',
                    value: `ban ${interaction.targetId}`
                },
                {
                    label: 'Kick',
                    description: 'Kickt ein Mitglied vom Server',
                    value: `kick ${interaction.targetId}`,
                }
            )
        );

        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`🗝️ **Moderiere** ${user} unten!`)
        .setThumbnail('https://media.discordapp.net/attachments/842303109463408641/1189054262924292198/icon_discord_mod_animated.gif?ex=659cc413&is=658a4f13&hm=912991125ee89450afce8b541530783d01209367037e7baf8d3e1ed76d1654b0&=')
        .setFooter({ text: `⚔️ Moderation`})
        .setTimestamp()

        await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true })
    }
}