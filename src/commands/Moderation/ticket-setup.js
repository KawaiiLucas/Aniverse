const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../../Schemas/ticketSchema');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Erstellt ein Ticket Panel.')
        .addChannelOption(option => option.setName('channel')
        .setDescription('Wohin das Ticket Panel gesendet werden soll').setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option => option.setName('category')
        .setDescription('In welcher Kategorie die Tickets erstellt werden sollen').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
        .addRoleOption(option => option.setName('role').setDescription('Welche Rolle bei einem erstellten Ticket gepingt werden soll').setRequired(true))
        .addChannelOption(option => option.setName('ticket-logs')
        .setDescription('Wohin die Transkripte geschickt werden sollen').setRequired(true))
        .addStringOption(option => option.setName('description')
        .setDescription('Die Beschreibung des Ticket Panels').setRequired(true).setMinLength(1).setMaxLength(1000))
        .addStringOption(option => option.setName('color')
        .setDescription('Die Farbe des Ticket Panels')
        .addChoices(
            { name: 'Red', value: 'Red' },
            { name: 'Blue', value: 'Blue' },
            { name: 'Green', value: 'Green' },
            { name: 'Yellow', value: 'Yellow' },
            { name: 'Purple', value: 'Purple' },
            { name: 'Pink', value: 'DarkVividPink' },
            { name: 'Orange', value: 'Orange' },
            { name: 'Black', value: 'NotQuiteBlack' },
            { name: 'White', value: 'White' },
            { name: 'Gray', value: 'Gray' },
            { name: 'Dark Blue', value: 'DarkBlue' },
            { name: 'Dark Red', value: 'DarkRed' },
        ).setRequired(true)),
 
 
    async execute(interaction, client) {
        try {
        const { options, guild } = interaction;
        const color = options.getString('color');
        const msg = options.getString('description');
        const thumbnail = interaction.guild.iconURL();
        const GuildID = interaction.guild.id;
        const panel = options.getChannel('channel');
        const category = options.getChannel('category');
        const role = options.getRole('role');
        const logs = options.getChannel('ticket-logs');
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({ content: 'Du hast nicht die Berechtigungen um diesen Befehl auszuführen.', ephemeral: true});
        }
 
        const data = await ticketSchema.findOne({ GuildID: GuildID });
        if (data) return await interaction.reply({ content: `Es existiert bereits ein Ticket Panel auf diesem Server!`, ephemeral: true});
 
        else {
            await ticketSchema.create({
                GuildID: GuildID,
                Channel: panel.id,
                Category: category.id,
                Role: role.id,
                Logs: logs.id,
            })
 
            const embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTimestamp()
            .setTitle('> Ticket System')
            .setFooter({ text: `🎫 Ticket Panel`})
            .setDescription(`> ${msg} `)
            .setThumbnail(interaction.guild.iconURL())
 
            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel('🎫 Ticket erstellen')
                .setStyle(ButtonStyle.Success)
            )
 
            const channel = client.channels.cache.get(panel.id);
            await channel.send({ embeds: [embed], components: [button] });
 
            await interaction.reply({ content: `Das Ticket Panel wurde in ${channel} gesendet.`, ephemeral: true });
        }
    } catch (err) {
        console.error(err);
    }
}
}