const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('web-screenshot')
    .setDescription('Mache ein Screenshot von einer Webseite')
    .addStringOption(option => option.setName('website').setDescription('Von welcher Seite soll ein Screenshot gemacht werden').setRequired(true)),
    async execute (interaction) {

        await interaction.deferReply({ ephemeral: false });

        const { options } = interaction;
        const website = options.getString('website');

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(website);
            await page.setViewport({ width: 1920, height: 1080 });

            const screenshot = await page.screenshot();
            await browser.close();

            const buffer = Buffer.from(screenshot, 'base64');
            const attachment = new AttachmentBuilder(buffer, { name: 'image.png' });

            const embed = new EmbedBuilder()
            .setColor('Red')
            .setImage('attachment://image.png')
            .setTimestamp()
            .setFooter({ text: 'Aniverse' })

            await interaction.editReply({ embeds: [embed], files: [attachment] });
        } catch (e) {
            await interaction.editReply({ content: `⚠ Es ist ein Fehler augetreten beim erstellen des Screenshots` });
        }
    }
}