const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("animated-avatar")
    .setDescription("Stelle ein animierten Avatar ein")
    .addAttachmentOption(option => option.setName("avatar").setDescription("Wähle ein GIF aus das der Bot haben soll").setRequired(true)),
    async execute (interaction, client) {

        const { options } = interaction;
        const avatar = options.getAttachment("avatar");

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (avatar.contentType !== "image/gif") return await sendMessage(`Dieses Bild ist kein GIF`)

        var error;
        await client.user.setAvatar(avatar.url).catch(async err => {
            error = true;
            console.log(err);
            return await sendMessage(`Error : \`${err.toString()}\``);
        });

        if (error) return;
        await sendMessage(`✅ Ich habe dein GIF als Avatar für den Bot eingestellt`)
    }
}