const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji} = require('discord.js');
const client = require("../../index")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Höre Musik")
    .addSubcommand(subcommand =>
        subcommand.setName("play")
        .setDescription("Spiele einen Song ab.")
        .addStringOption(option =>
            option.setName("query")
            .setDescription("Gib den Namen oder die URL des Songs an den du hören möchtest.")
            .setRequired(true)
        )
     )
     .addSubcommand(subcommand =>
        subcommand.setName("volume")
        .setDescription("Passe die Lautstärke an.")
        .addNumberOption(option =>
            option.setName("percent")
            .setDescription("10 = 10%")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
     )
     .addSubcommand(subcommand =>
        subcommand.setName("options")
        .setDescription("Wähle eine Option aus.")
        .addStringOption(option =>
            option.setName("options")
            .setDescription("Wähle eine Option aus.")
            .setRequired(true)
            .addChoices(
                {name: "queue", value: "queue"},
                {name: "skip", value: "skip"},
                {name: "pause", value: "pause"},
                {name: "resume", value: "resume"},
                {name: "stop", value: "stop"},
            )
        )
     ), 
     async execute(interaction, client) {
        const {options, member, guild, channel} = interaction;

        const subcommand = options.getSubcommand();
        const query = options.getString("query");
        const volume = options.getNumber("percent");
        const option = options.getString("options");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("Du musst in einem Voicechat sein um Musik hören zu können.");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`Du kannst derzeit keine Musik hören da der Bot bereits in <#${guild.members.me.voice.channelId}> Musik abspielt.`);
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }

        try {
            switch (subcommand) {
                case "play":
                    client.distube.play(voiceChannel, query, {textChannel: channel, member: member});
                    return interaction.reply ({ content: "🎶 Suche nach deinem Song..."});
                case "volume":
                    client.distube.setVolume(voiceChannel, volume);
                    return interaction.reply ({ content: `🔊 Die **Lautstärke** wurde zu **${volume}**% geändert.`});
                case "options":
                    const queue = await client.distube.getQueue(voiceChannel);

                    if(!queue) {
                        embed.setColor("Red").setDescription("Es gibt keine aktive Warteschlange.");
                        return interaction.reply({ embeds: [embed], ephemeral: true});
                    }

                    switch(option) {
                        case "skip":
                            await queue.skip(voiceChannel);
                            embed.setColor("Green").setDescription("⏩ Der Song wurde übersprungen");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "stop":
                            await queue.stop(voiceChannel);
                            embed.setColor("Green").setDescription("🛑 Die Playlist wurde gestoppt");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "pause":
                            await queue.pause(voiceChannel);
                            embed.setColor("Green").setDescription("⏸️ Der/die Song(s) wurde/n pausiert");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "resume":
                            await queue.resume(voiceChannel);
                            embed.setColor("Green").setDescription("▶️ Der/die Song(s) wurde(n) fortgesetzt");
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                        case "queue":
                            await queue.pause(voiceChannel);
                            embed.setColor("Green").setDescription(`${queue.songs.map(
                                (song, id) => `\n**${id + 1}.** ${song.name} -\` ${song.formattedDuration} \``
                            )}`);
                            return interaction.reply({ embeds: [embed], ephemeral: true});
                            
                    }
            }
        }catch(err) {
            console.log(err);

            embed.setColor("Red").setDescription("❌ | Es ist ein Fehler aufgetreten...");

            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
     }
}