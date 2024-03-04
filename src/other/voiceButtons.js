const { Interaction,ModalBuilder,ActionRowBuilder,TextInputStyle,TextInputBuilder, EmbedBuilder, PermissionFlagsBits, Message } = require("discord.js");
const config = require('../config.json')
const { MongoClient } = require('mongodb');
require('dotenv').config()
let db;
let collection;
(async () => {
    try {
        const mongoClient = new MongoClient(process.env.mongoURL);
        await mongoClient.connect();
        db = mongoClient.db('xpbot');
        pChannels = db.collection('pChannels');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
})();
module.exports = async function (interaction) {
    try {
        privateChannel = await pChannels.findOne({ guildId: interaction.guildId, channelId: interaction.channelId });
        if (interaction.customId.startsWith("lock") && privateChannel.owner == interaction.user.id) {
            if (!interaction.channel.permissionsFor(interaction.guild.roles.everyone).has(PermissionFlagsBits.Connect)) return await interaction.reply({
                content: `🚫 Channel ist bereits gesperrt`,
                ephemeral: true
            })
            interaction.channel.permissionOverwrites.edit(config.serverid, {
                Connect: false
            });
            interaction.channel.permissionOverwrites.edit(interaction.user.id, {
                Connect: true
            });
            await interaction.reply({
                content: `✅ Channel wurde gesperrt!`,
                ephemeral: true
            })
        } else {
            if (privateChannel.owner !== interaction.user.id) {
                try {
                    await interaction.reply({
                        content: `❌ Nur der Besitzer des Voicechats kann das machen!`,
                        ephemeral: true
                    })
                } catch (error) {
                    console.log(err)
                }
            }
        }


        if (interaction.customId.startsWith("unlock") && privateChannel.owner == interaction.user.id) {
            if (interaction.channel.permissionsFor(interaction.guild.roles.everyone).has(PermissionFlagsBits.Connect)) return await interaction.reply({
                content: `🚫 Channel ist bereits entsperrt!`,
                ephemeral: true
            })
            interaction.channel.permissionOverwrites.edit(config.serverid, {
                Connect: true
            });
            interaction.channel.permissionOverwrites.edit(interaction.user.id, {
                Connect: true
            });
            await interaction.reply({
                content: `✅ Channel wurde entsperrt!`,
                ephemeral: true
            })
        } else {

            if (privateChannel.owner !== interaction.user.id) {
                try {
                    await interaction.reply({
                        content: `❌ Nur der Besitzer des Voicechats kann das machen!`,
                        ephemeral: true
                    })
                } catch (error) {
                    console.log(err)
                }
            }
        }




        if (interaction.customId.startsWith("limit") && privateChannel.owner == interaction.user.id) {
            const modal = new ModalBuilder()
                .setCustomId('voiceModal')
                .setTitle('Voice Channel Manage');
            const limit = new TextInputBuilder()
                .setCustomId('channellimit')
                .setLabel("Channel Limit (Zahl)")
                .setMinLength(1)
                .setMaxLength(2)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(limit);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal);
        } else {

            if (privateChannel.owner !== interaction.user.id) {
                try {
                    await interaction.reply({
                        content: ` ❌ Nur der Besitzer des Channels kann das machen!`,
                        ephemeral: true
                    })
                } catch (error) {
                    console.log(err)
                }
            }
        }


        if (interaction.customId.startsWith("owner") && privateChannel.owner == interaction.user.id) {
            await interaction.reply({
                content: 'Bitte erwähne den User dem du die Rechte von dem Voicechat geben willst::',
                ephemeral: true
            });
            const filter = m => {
                const mentionRegex = /<@!?(\d+)>/;
                return m.content.match(mentionRegex);
            };
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 }); // Adjust the time limit as needed
            collector.on('collect', async collected => {
                const mentionedUserId = collected.content.match(/<@!?(\d+)>/)[1];

                // Save changes to the database or wherever the channel data is stored
                // Example: await privateChannel.save();

                await pChannels.updateOne({ guildId: interaction.guild.id, channelId: interaction.channelId }, { $set: { owner: mentionedUserId } });
                await interaction.followUp({
                    content: `✅ Die Benutzerreche des Voicechats wurden an <@${mentionedUserId}> übergeben.`,
                    ephemeral: true
                });

                collector.stop();
            });
            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({
                        content: '❌ Es ist ein Fehler aufgetreten beim Versuch die Benutzerreche zu übergeben. Bitte versuche es nocheinmal.',
                        ephemeral: true
                    });
                }
            });
        } else {
            if (privateChannel.owner !== interaction.user.id) {
                try {
                    await interaction.reply({
                        content: `❌ Nur der Besitzer des Voicechats kann das machen!`,
                        ephemeral: true
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }

        if (interaction.customId.startsWith("kick") && privateChannel.owner == interaction.user.id) {
            await interaction.reply({
                content: 'Bitte erwähne den User den du kicken willst:',
                ephemeral: true
            });
            const filter = m => {
                const mentionRegex = /<@!?(\d+)>/;
                return m.content.match(mentionRegex);
            };
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 }); // Adjust the time limit as needed
            collector.on('collect', async collected => {
                const mentionedUserId = collected.content.match(/<@!?(\d+)>/)[1];

                // Save changes to the database or wherever the channel data is stored
                // Example: await privateChannel.save();

                const userToKick = interaction.guild.members.cache.get(mentionedUserId)
                if (userToKick.voice.channel && userToKick.voice.channel.id === privateChannel.channelId) {
                    await userToKick.voice.disconnect()
                    .catch(err => {
                        console.error(`Error kicking ${mentionedUserId}: ${err}`);
                    })
                    const channeld = await privateChannel
                    if (channeld) {
                        await interaction.followUp({
                            content: `<@${mentionedUserId}> wurde gekickt.`,
                            ephemeral: true
                        });
                    }
                }else {
                    await interaction.followUp({
                        content: `Dieser User ist nicht im Voicechat`,
                        ephemeral: true
                    });
                }

                collector.stop();
            });
            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({
                        content: 'Beim Kicken ist ein Fehler aufgetreten. Bitte versuche es nocheinmal.',
                        ephemeral: true
                    });
                }
            });
        } else {
            if (privateChannel.owner !== interaction.user.id) {
                try {
                    await interaction.reply({
                        content: `❌ Nur der Beistzer des Voicechats kann das machen!`,
                        ephemeral: true
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }




        if (interaction.customId == 'voiceModal') {
            const limit = Number(interaction.fields.getTextInputValue('channellimit'));
            interaction.channel.setUserLimit(limit)
            await interaction.reply({
                content: `✅ Das Limit vom Voicechat wurde geändert`,
                ephemeral: true
            })
        }
    } catch (error) {
        console.error('Error handlich Bad Words:', error);
    }
};