const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("modpanel")
    .setDescription("Verwalte einen User mit dem Modpanel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName("target")
        .setDescription("Welches Mitglied es betrefffen soll")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("Gib ein Grund für die Aktion an (optional)")
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const {guild, options} = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason") || "Kein Grund angegeben";
        const username = target
        const user = interaction.user.id

        if (
            !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
          )
            return await interaction.reply({
              content:
                "❌ Du hast nicht die Berechtigung um diesen Befehl auszuführen!",
              ephemeral: true,
            });

        if (target === interaction.user) {
            return await interaction.reply({
                content: "Du kannst dieses Panel nicht für dich selbst benutzen!",
                ephemeral: true
            })
        }

        //timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("5 Minuten Timeout")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("10 Minuten Timeout")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("1 Stunde Timeout")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("1 Tag Timeout")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("1 Woche Timeout")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Ban")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("✅")
            .setLabel("Untimeout")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle("Moderation Panel")
        .setColor('Orange')
        .setImage('https://media.discordapp.net/attachments/842303109463408641/1204665543152373800/Titelloses_72_20240207065029.png?ex=65d58f37&is=65c31a37&hm=279171174075a2e6656c336757f5b2d461f29489bfcf4d21cfe1987d37648d88&=&format=webp&quality=lossless&width=810&height=243')
        .setDescription(`Hier ist das Panel womit du bei <@${target.id}> einige Aktionen ausführen kannst!`)
        .addFields(
            {name: "Name", value: `${username}`, inline: true},
            {name: "User ID", value: `${target.id}`, inline: true},
            {name: "User", value: `<@${target.id}>`, inline: true},
            {name: "Avatar URL", value: `[Avatar](${await target.displayAvatarURL()})`, inline: true},
            {name: "Grund", value: `${reason}`, inline: false}
        )
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.reply({
            embeds: [embed],
            components: [Row, tRow],
            ephemeral: false
        });

        const collector = msg.createMessageComponentCollector();

        const embed3 = new EmbedBuilder()
        .setColor('Blue')
        .setImage('https://i.imgur.com/iBdxcV6.gif')
        .setTimestamp()
        .setFooter({ text: `Moderator: ${interaction.user.username}`})

        collector.on('collect', async i => {
            if (i.customId === "ban") {
                if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    return await i.reply({
                        content: "Du kannst keine Mitglieder bannen!",
                        ephemeral: true
                    })
                }

                await interaction.guild.members.ban(target, {reason});

                embed3.setTitle("Ban").setDescription(`Du wurdest auf ${i.guild.name} gebannt! || **Grund:** ${reason}`).setColor('Orange').setImage("https://media.discordapp.net/attachments/842303109463408641/1204665543152373800/Titelloses_72_20240207065029.png?ex=65d58f37&is=65c31a37&hm=279171174075a2e6656c336757f5b2d461f29489bfcf4d21cfe1987d37648d88&=&format=webp&quality=lossless&width=810&height=243")

                await target.send({ embeds: [embed3] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> wurde gebannt!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Du hast nicht die Berechtigung um Mitglieder stummzuschalten!", ephemeral: true})
                await target.timeout(null);

                embed.setTitle("Untimeout").setDescription(`Dein Timeout auf ${i.guild.name} wurde entfernt! || **Grund:** ${reason}`).setColor('Orange').setImage('https://media.discordapp.net/attachments/842303109463408641/1204665543152373800/Titelloses_72_20240207065029.png?ex=65d58f37&is=65c31a37&hm=279171174075a2e6656c336757f5b2d461f29489bfcf4d21cfe1987d37648d88&=&format=webp&quality=lossless&width=810&height=243');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.reply({ content: `Der Timeout von <@${target.id}> wurde entfernt`, ephemeral: true});
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return await i.reply({ content: "You dont have the permission to **KICK** Members!", ephemeral: true});

                await interaction.guild.members.kick(target, {reason});

                embed.setTitle("Kick").setDescription(`Du wurdest von ${i.guild.name} gekickt! || **Grund:** ${reason}`).setColor('Orange').setImage('https://media.discordapp.net/attachments/842303109463408641/1204665543152373800/Titelloses_72_20240207065029.png?ex=65d58f37&is=65c31a37&hm=279171174075a2e6656c336757f5b2d461f29489bfcf4d21cfe1987d37648d88&=&format=webp&quality=lossless&width=810&height=243')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been kicked!`, ephemeral: true});
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **5 Minutes** || **Reason:** ${reason}`).setColor('Orange').setImage('https://media.discordapp.net/attachments/842303109463408641/1204665543152373800/Titelloses_72_20240207065029.png?ex=65d58f37&is=65c31a37&hm=279171174075a2e6656c336757f5b2d461f29489bfcf4d21cfe1987d37648d88&=&format=webp&quality=lossless&width=810&height=243');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **5 Minutes**`, ephemeral: true});
            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **10 Minutes** || **Reason:** ${reason}`).setColor('Orange');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **10 Minutes**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for *1 Hour** || **Reason:** ${reason}`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Hour**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **1 Day** || **Reason:** ${reason}`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Day**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`You have been timeouted for **1 Week** || **Reason** ${reason}`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Week**`, ephemeral: true});
            }

            
        })
    }
}