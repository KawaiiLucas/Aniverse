const { WebhookClient, EmbedBuilder } = require("discord.js");

module.exports = (client) => {
    process.removeAllListeners();

    const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1205984623910322197/Yywj6dMu_64CgUe6FlsCur47vn9bJN8W1Fo0T_L7oAgNNPgIpegxWkWEgTvWOZYHjUuL' });

    const embed = new EmbedBuilder()
        .setColor(`Red`)
        .setAuthor({ name: `❎ Es ist ein Fehler aufgetreten` })

    process.on("unhandledRejection", (reason, p) => {

        let reasonString = reason instanceof Error ? reason.stack : String(reason);

        webhook.send({
            username: 'Error!',
            avatarURL: '',
            embeds: [embed.setDescription(`${reasonString}`)],
        });

        console.error(reason, p);
    });

    process.on("uncaughtException", (err, origin) => {
        let errString = err instanceof Error ? err.stack : String(err);

        webhook.send({
            username: 'Error!',
            avatarURL: '',
            embeds: [embed.setDescription(`${errString}`)],
        });

        console.error(err, origin);
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        let errString = err instanceof Error ? err.stack : String(err);

        webhook.send({
            username: 'Error!',
            avatarURL: '',
            embeds: [embed.setDescription(`${errString}`)],
        });

        console.error(err, origin);
    });

    process.on("multipleResolves", () => { });

};