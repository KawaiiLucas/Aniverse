const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('botstats')
    .setDescription('Einige Informationen über den Bot'),
    async execute (interaction, client) {

        const name = "Aniverse";
        const icon = `${client.user.displayAvatarURL()}`;
        let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} Tage, ${hours} Stunden, ${minutes} Minuten, ${seconds} Sekunden`;

        let ping = `${Date.now() - interaction.createdTimestamp}ms.`;

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Server')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/aniverse-1090278417213161632'),
            
            new ButtonBuilder()
            .setLabel('Bot einladen')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/api/oauth2/authorize?client_id=1182302970348576888&permissions=70368744177655&scope=bot')
        )

        const embed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: name, iconURL: icon })
        .setThumbnail(`${icon}`)
        .setFooter({ text: "Bot ID: 1182302970348576888" })
        .setTimestamp()
        .addFields({ name: 'Insgesamt auf Server', value: `${client.guilds.cache.size}`, inline: true })
        .addFields({ name: 'Server Mitglieder', value: `${servercount}`, inline: true })
        .addFields({ name: 'Latenz', value: `${ping}`, inline: true }).addFields({ name: 'Insgesamt auf Server', value: `${client.guilds.cache.size}`, inline: true })
        .addFields({ name: 'Online seit', value: `\`\`\`${uptime}\`\`\``, inline: true })

        await interaction.reply({ embeds: [embed], components: [row] });
    }
}