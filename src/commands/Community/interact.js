const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const profileschema = require('../../Schemas/interactionSchema');
const hug = require('../../hug.json');
const slap = require('../../slap.json');
const kill = require('../../kill.json');
const kiss = require('../../kiss.json');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('interagiere')
    .setDMPermission(false)
    .setDescription('Interagiere mit einem Mitglied')
    .addSubcommand(command => command.setName('hug').setDescription('Umarme ein anderes Mitglied.').addUserOption(option => option.setName('user').setDescription('Umarme ein Mitglied deiner Wahl.').setRequired(true)))
    .addSubcommand(command => command.setName('slap').setDescription('Slap ein anderes Mitglied.').addUserOption(option => option.setName('user').setDescription('Slappe ein Mitglied deiner Wahl.').setRequired(true)))
    .addSubcommand(command => command.setName('kill').setDescription('Kille ein anderes Mitglied.').addUserOption(option => option.setName('user').setDescription('Kille ein Mitglied deiner Wahl').setRequired(true)))
    .addSubcommand(command => command.setName('kiss').setDescription('Kisst ein anderes Mitglied.').addUserOption(option => option.setName('user').setDescription('Küsse ein Mitglied deiner').setRequired(true)))
    .addSubcommand(command => command.setName('profile').setDescription(`Zeigt die Stats der Interactions eines Mitgliedes an.`).addUserOption(option => option.setName('user').setDescription('Von wem du das Profile sehen willst.').setRequired(false))),
    async execute(interaction) {
 
        const user = await interaction.options.getMember('user') || interaction.member;
        const displayuser = await interaction.options.getUser('user') || interaction.user;
 
        if (!user) return await interaction.reply({ content: `Das Mitglied ${displayuser} gibt es auf diesem Server nicht :(`, ephemeral: true});
 
        const sub = interaction.options.getSubcommand();
        let data = await profileschema.findOne({ User: interaction.user.id });
        let interactdata = await profileschema.findOne({ User: displayuser.id });
 
        switch (sub) {
            case 'hug':
 
            if (interaction.user.id === displayuser.id) {
 
                await interaction.reply({ content: `Du kannst dich nicht selbst umarmen :(`, ephemeral: true});
                await interaction.channel.send({ content: `${interaction.user} hat versucht sich selbst zu **umarmen**, umarmt den/die arme/n mal :(`});
 
                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 1,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                }
 
            } else {
 
                const randomizer = Math.floor(Math.random() * hug.length);
 
                const hugembed = new EmbedBuilder()
                .setColor('Purple')
                .setTimestamp()
                .setTitle('> Eine wundervolle Umarmung!')
                .setFooter({ text: `❤️ Umarmung!`})
                .setAuthor({ name: `❤️ Interaction System`})
                .setThumbnail('https://media.discordapp.net/attachments/842303109463408641/1188296104861769728/a_bcecf2e7f8f6bee4a4b7faba33ba463d.gif?ex=659a01fc&is=65878cfc&hm=78f4fd42032c4a651c30a1042037d7b36d59917f60a5d730050f65a6bdc3980e&=')
                .setImage(hug[randomizer])
                .addFields({ name: `• Umarmung`, value: `> ${interaction.user} hat \n> ${displayuser} umarmt. ❤️`})
 
                await interaction.reply({ embeds: [hugembed], content: `${displayuser}` });
 
                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 0,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { HugGive: data.HugGive + 1 }});
                }
 
                if (!interactdata) {
                    interactdata = await profileschema.create({
                        User: displayuser.id,
                        HugGive: 0,
                        Hug: 1,
                        Fail: 0,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: displayuser.id }, { $set: { Hug: interactdata.Hug + 1}});
                }
 
            }
 
            break;
            case 'profile':
 
            if (!interactdata) return await interaction.reply({ content: `Das Mitglied hat bisher noch **keine** Statistiken erhalten.`, ephemeral: true});
            else {
 
                const statembed = new EmbedBuilder()
                .setColor('Red')
                .setTimestamp()
                .setAuthor({ name: `❤️ Interaction System`})
                .setFooter({ text: `❤️ Profile Anzeige`})
                .setTitle(`> ${displayuser.username}'s Profile`)
                .setThumbnail('https://media.discordapp.net/attachments/842303109463408641/1188296104861769728/a_bcecf2e7f8f6bee4a4b7faba33ba463d.gif?ex=659a01fc&is=65878cfc&hm=78f4fd42032c4a651c30a1042037d7b36d59917f60a5d730050f65a6bdc3980e&=')
                .addFields(
                    { name: `| • Interactionen erhalten`, value: `> • **Hugs**: ${interactdata.Hug} \n> • **Slaps**: ${interactdata.Slap} \n> • **Kills**: ${interactdata.Kill} \n> • **Kisses**: ${interactdata.Kiss}`, inline: false},
                    { name: `| • Interactionen verteilt`, value: `> • **Hugs**: ${interactdata.HugGive} \n> • **Slaps**: ${interactdata.SlapGive} \n> • **Kills**: ${interactdata.KillGive} \n> • **Kisses**: ${interactdata.KissGive}`, inline: true},
                    { name: `| • Failures`, value: `> • **Fails**: ${interactdata.Fail} \n> • **Real Errors**: ${interactdata.Err}`, inline: false}
                )
 
                await interaction.reply({ embeds: [statembed] });
            }
 
            break;
            case 'slap':
 
            if (interaction.user.id === displayuser.id) {
 
                await interaction.reply({ content: `Du hast versucht dich selbst zu **schlagen**, you are weird.. 👋`, ephemeral: true});
                await interaction.channel.send({ content: `${interaction.user} hat versucht sich selbst zu **schlagen**, for some reason.. 👋`});
 
                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 1,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                }
 
            } else {
 
                const results = [
                    { name: `${interaction.user} **slapped** ${displayuser}!`, result: `s`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> aber ${displayuser} antwortete mit einem \n> **explosiven** Punch!`, result: `f`},
                    { name: `${interaction.user} triggered raging mode, \n> ${displayuser}'s **Versuche**  \n> Der **slap** blieb unbemerkt.`, result: `s`},
                    { name: `${interaction.user} hat versucht ${displayuser} zu **schlagen** aber \n> ${displayuser} ist der **Attacke** ausgewichen, \n> was für ein Fail! (oh yeah, ${displayuser} slapped \n> you back)`, result: `f`},
                    { name: `${interaction.user} konnte erst ${displayuser} nicht schlagen, aber \n> **Lelouch** helped \n> them out! **What a save :o**`, result: `s`},
                    { name: `${interaction.user} hat versucht ${displayuser} zu **schlagen**, \n> aber **LucasXIII** hatte Mitleid und \n> **slapped** stattdessen ${interaction.user} :(`, result: `f`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> er/sie wird sich daran **erinnern**...`, result: `s`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> wie gemein!`, result: `s`},
                    { name: `Hmm sieht so aus als wäre ein **Fehler** aufgetreten \n> versuchs vielleicht wann anders nochmal`, result: `e`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> lol.. **W** play 😎`, result: `s`},
                    { name: `${interaction.user} **slapped** ${displayuser}, \n> wird er/sie sich **rächen**?`, result: `s`}
                ]
 
                const randomizer = Math.floor(Math.random() * slap.length);
                const failchance = Math.floor(Math.random() * results.length);
 
                const slapembed = new EmbedBuilder()
                .setColor('Purple')
                .setTimestamp()
                .setTitle('> Ooo, a SLAP!')
                .setFooter({ text: `👋 Slap Given!`})
                .setAuthor({ name: `👋 Interaction System`})
                .setThumbnail('https://media.discordapp.net/attachments/842303109463408641/1188296104861769728/a_bcecf2e7f8f6bee4a4b7faba33ba463d.gif?ex=659a01fc&is=65878cfc&hm=78f4fd42032c4a651c30a1042037d7b36d59917f60a5d730050f65a6bdc3980e&=')
                .setImage(slap[randomizer])
 
                if (results[failchance].result === 'f') {
                    slapembed.addFields({ name: `• Slap Given`, value: `> ${results[failchance].name}`})
                }
 
                if (results[failchance].result === 's') {
                    slapembed.addFields({ name: `• Slap Given`, value: `> ${results[failchance].name}`})
                }
 
                if (results[failchance].result === 'e') {
                    slapembed.addFields({ name: `• Slap Error?`, value: `> ${results[failchance].name}`})
                    slapembed.setImage('https://media.discordapp.net/attachments/842303109463408641/1188296104861769728/a_bcecf2e7f8f6bee4a4b7faba33ba463d.gif?ex=659a01fc&is=65878cfc&hm=78f4fd42032c4a651c30a1042037d7b36d59917f60a5d730050f65a6bdc3980e&=')
 
                    if (!data) {
 
                        data = await profileschema.create({
                            User: interaction.user.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 1,
                            Kiss: 0,
                            KissGive: 0
                        })
 
                    } else {
                        await profileschema.updateOne({ User: interaction.user.id }, { $set: { Err: data.Err + 1 }});
                    }
                }
 
                await interaction.reply({ embeds: [slapembed], content: `${displayuser}` });
 
 
                if (results[failchance].result === 'e') return;
                else {
 
                    if (results[failchance].result === 's') {
 
                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 1,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { SlapGive: data.SlapGive + 1 }});
                        }
 
                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 1,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { Slap: interactdata.Slap + 1}});
                        }
 
                    } else if (results[failchance].result === 'f') {
 
                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 1,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Slap: data.Slap + 1 }});
                        }
 
                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 1,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { SlapGive: interactdata.SlapGive + 1}});
                        }
                    }
                }
            }
 
            break;
            case 'kill':
 
            if (interaction.user.id === displayuser.id) {
 
                await interaction.reply({ content: `Du hast versucht dich selbst zu **killen**, emotional damage? 🔪`, ephemeral: true});
                await interaction.channel.send({ content: `${interaction.user} hat versucht sich selbst zu **killen**, give them some support.. 🔪`});
 
                if (!data) {
                    data = await profileschema.create({
                        User: interaction.user.id,
                        HugGive: 0,
                        Hug: 0,
                        Fail: 1,
                        Slap: 0,
                        SlapGive: 0,
                        Kill: 0,
                        KillGive: 0,
                        Err: 0,
                        Kiss: 0,
                        KissGive: 0
                    })
                } else {
                    await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                }
 
            } else {
 
                const results = [
                    { name: `${interaction.user} **killed** ${displayuser}!`, result: `s`},
                    { name: `${interaction.user} **hat versucht** ${displayuser} zu **killen**, \n> aber ${displayuser} antwortete mit einem \n> **explosiven** punch!`, result: `f`},
                    { name: `${interaction.user} triggered raging mode, \n> ${displayuser}'s **attempts** to avoid \n> the **knife** went unoticed.`, result: `s`},
                    { name: `${interaction.user} tried to **kill** ${displayuser} aber \n> ${displayuser} ist der **Attacke** ausgewichen, \n> was ein fail! (oh yeah, ${displayuser} killed \n> you)`, result: `f`},
                    { name: `${interaction.user} **couldn't** kill ${displayuser} at \n> first, but **Lelouch** helped \n> them out! **Group murder babbyyy!**`, result: `s`},
                    { name: `${interaction.user} tried to **kill** ${displayuser}, \n> but **LucasXIII** hatte Mitleid und \n> **killed** stattdessen ${interaction.user} :(`, result: `f`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> er/sie wird sich daran **erinnern**...`, result: `s`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> wie gemein!`, result: `s`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> lol.. **skill issue** 😎`, result: `s`},
                    { name: `${interaction.user} **killed** ${displayuser}, \n> wird er/sie  sich **räche?**? (wird er/sie nicht, \n> er/sie ist dead)`, result: `s`}
                ]
 
                const randomizer = Math.floor(Math.random() * kill.length);
                const failchance = Math.floor(Math.random() * results.length);
 
                const killembed = new EmbedBuilder()
                .setColor('Red')
                .setTimestamp()
                .setTitle('> A murder!')
                .setFooter({ text: `🔪 Killed a Guy`})
                .setAuthor({ name: `🔪 Interaction System`})
                .setThumbnail('https://media.discordapp.net/attachments/842303109463408641/1188296104861769728/a_bcecf2e7f8f6bee4a4b7faba33ba463d.gif?ex=659a01fc&is=65878cfc&hm=78f4fd42032c4a651c30a1042037d7b36d59917f60a5d730050f65a6bdc3980e&=')
                .setImage(kill[randomizer])
 
                if (results[failchance].result === 'f') {
                    killembed.addFields({ name: `• Kill Confirmed`, value: `> ${results[failchance].name}`})
                }
 
                if (results[failchance].result === 's') {
                    killembed.addFields({ name: `• Murder Failed`, value: `> ${results[failchance].name}`})
                }
 
                await interaction.reply({ embeds: [killembed], content: `${displayuser}` });
 
 
 
                if (results[failchance].result === 's') {
 
                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 1,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { KillGive: data.KillGive + 1 }});
                        }
 
                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 1,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { Kill: interactdata.Kill + 1}});
                        }
 
                    } else if (results[failchance].result === 'f') {
 
                        if (!data) {
                            data = await profileschema.create({
                                User: interaction.user.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 1,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 0,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                            await profileschema.updateOne({ User: interaction.user.id }, { $set: { Slap: data.Kill + 1 }});
                        }
 
                        if (!interactdata) {
                            interactdata = await profileschema.create({
                                User: displayuser.id,
                                HugGive: 0,
                                Hug: 0,
                                Fail: 0,
                                Slap: 0,
                                SlapGive: 0,
                                Kill: 0,
                                KillGive: 1,
                                Err: 0,
                                Kiss: 0,
                                KissGive: 0
                            })
                        } else {
                            await profileschema.updateOne({ User: displayuser.id }, { $set: { KillGive: interactdata.KillGive + 1}});
                    }
                } 
            }
 
            break;
            case 'kiss':
 
            const results = [
                { name: `${interaction.user} **kissed** ${displayuser}!`, result: `s`},
                { name: `${interaction.user} **tried to kiss** ${displayuser}, \n> but ${displayuser} responded with an \n> **explosive** slap to the face!`, result: `f`},
                { name: `${interaction.user} triggered raging mode, \n> ${displayuser}'s **attempts** to avoid \n> the **kiss** went unoticed.`, result: `s`},
                { name: `${interaction.user} tried to **kiss** ${displayuser} but \n> ${displayuser} dodged their **mouth**, \n> what a fail! (oh yeah, ${displayuser} reported \n> you for sexual harassment)`, result: `f`},
                { name: `${interaction.user} **couldn't** kiss ${displayuser} at \n> first, but **JASO0ON** helped \n> them out! **We all need a little help!**`, result: `s`},
                { name: `${interaction.user} tried to **kill** ${displayuser}, \n> but **JASO0ON** felt mercy and \n> **kissed** ${interaction.user} instead, what`, result: `f`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> they **liked** that..`, result: `s`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> how romantic!`, result: `s`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> lol.. **W** rizz 😎`, result: `s`},
                { name: `${interaction.user} **kissed** ${displayuser}, \n> will they do it back?`, result: `s`}
            ]
 
            const randomizer = Math.floor(Math.random() * kill.length);
            const failchance = Math.floor(Math.random() * results.length);
 
            const kissembed = new EmbedBuilder()
            .setColor('Red')
            .setTimestamp()
            .setTitle('> A wonderful kiss!')
            .setFooter({ text: `💋 Kiss Occured`})
            .setAuthor({ name: `💋 Interaction System`})
            .setThumbnail('https://media.discordapp.net/attachments/842303109463408641/1188296104861769728/a_bcecf2e7f8f6bee4a4b7faba33ba463d.gif?ex=659a01fc&is=65878cfc&hm=78f4fd42032c4a651c30a1042037d7b36d59917f60a5d730050f65a6bdc3980e&=')
            .setImage(kiss[randomizer])
 
            if (results[failchance].result === 'f') {
                kissembed.addFields({ name: `• You were rejected`, value: `> ${results[failchance].name}`})
            }
 
            if (results[failchance].result === 's') {
                kissembed.addFields({ name: `• You kissed someone`, value: `> ${results[failchance].name}`})
            }
 
            await interaction.reply({ embeds: [kissembed], content: `${displayuser}` });
 
 
 
            if (results[failchance].result === 's') {
 
                    if (!data) {
                        data = await profileschema.create({
                            User: interaction.user.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 0,
                            KissGive: 1
                        })
                    } else {
                        await profileschema.updateOne({ User: interaction.user.id }, { $set: { KissGive: data.KissGive + 1 }});
                    }
 
                    if (!interactdata) {
                        interactdata = await profileschema.create({
                            User: displayuser.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 0,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 1,
                            KissGive: 0
                        })
                    } else {
                        await profileschema.updateOne({ User: displayuser.id }, { $set: { Kiss: interactdata.Kiss + 1}});
                    }
 
                } else if (results[failchance].result === 'f') {
 
                    if (!data) {
                        data = await profileschema.create({
                            User: interaction.user.id,
                            HugGive: 0,
                            Hug: 0,
                            Fail: 1,
                            Slap: 0,
                            SlapGive: 0,
                            Kill: 0,
                            KillGive: 0,
                            Err: 0,
                            Kiss: 0,
                            KissGive: 0
                        })
                    } else {
                        await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 }});
                    }
            } 
        }
    }
}