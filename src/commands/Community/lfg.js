const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lfg')
    .setDescription('Suche nach Spielern für ein besimmtes Game')
    .addStringOption(option => option.setName('game').setDescription('Für welches Game suchst du andere Mitspieler?').setRequired(true)),
    async execute (interaction) {

        var { options } = interaction;
        var game = options.getString('game');

        var members = await interaction.guild.members.fetch();

        var group = [];
        await members.forEach(async member => {
            if (!member.presence || !member.presence.activities[0]) return;

            var currentGame = await member.presence.activities[0].name;

            if (currentGame.toLowerCase() == game.toLowerCase()) group.push({ member: member.id, spiel: currentGame })
            else return;
        });

        group = group.slice(0, 2000);

        const embed = new EmbedBuilder()
        .setColor('Orange')

        var string;
        await group.forEach(async value => {
            const member = await interaction.guild.members.cache.get(value.member);
            string += `Member: <@${member.user.id}> (${value.member}) spielt gerade ${value.game}\n`;
        });

        if (string) {
            string = string.replace('undefined', '');

            embed
            .setTitle(`Diese Mitglieder spielen gerade \`${game}\``)
            .setDescription(string);
        } else {
            embed.setDescription(`👉 Im Moment spielt keiner \`${game}\``);
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}