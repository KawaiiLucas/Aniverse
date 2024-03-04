const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translator')
    .addStringOption(option => option.setName('message').setDescription('What do you want to translate?').setRequired(true))
    .addStringOption(option => option.setName('language').setDescription('The language you want to translate to').addChoices(
        { name: 'English', value: 'en' },
        { name: 'Latin', value: 'la' },
        { name: 'French', value: 'fr' },
        { name: 'German', value: 'de' },
        { name: 'Italian', value: 'it' },
        { name: 'Portugese', value: 'pt' },
        { name: 'Spanish', value: 'es' },
        { name: 'Greek', value: 'gl' },
        { name: 'Russian', value: 'ru' },
        { name: 'Japanese', value: 'ja' },
        { name: 'Arabic', value: 'ar' },
    ).setRequired(true)),
    async execute (interaction) {

        const { options } = interaction;
        const text = options.getString('message');
        const lan = options.getString('language');

        await interaction.reply({ content: '⏳ Translating your language...', ephemeral: true });

        const applied = await translate(text, { to: `${lan}` });

        const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('✅ Übersetzung war erfolgreich')
        .addFields({ name: '❌ Old Text', value: `\`\`\`${text}\`\`\``, inline: false })
        .addFields({ name: '📌 Translated Text', value: `\`\`\`${applied.text}\`\`\``, inline: false })
        .setFooter({ text: 'Aniverse Translator', iconURL: 'https://media.discordapp.net/attachments/1184440284264804442/1185007756755869739/8e3a722bfb20b4b0766f4750fc18bcea.webp?ex=658e0b79&is=657b9679&hm=3c4d167ce28444d6024e2fdd2343660f9bf1471f84187553ef100697d3b9e9ab&=&format=webp&width=468&height=468' })
        .setTimestamp()

        await interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }
}