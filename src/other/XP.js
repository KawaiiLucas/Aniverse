const { Interaction, EmbedBuilder, PermissionFlagsBits, Message } = require("discord.js");
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
      collection = db.collection('userXp');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  })();

  function findRoleIds(curLvl) {
    const roles = config['level-role'];
    for (let i = 0; i < 10; i++) {
        if(roles[i] && roles[i].reqLevel) {
            if (roles[i].reqLevel == curLvl) {
                return roles[i].roleId;
            }
        }
      }
  }
module.exports = async function (message) {
    try {
        let userXpData = await collection.findOne({ guildId: message.guild.id, userId: message.author.id });

        if (!userXpData) {
            userXpData = {
                guildId: message.guild.id,
                userId: message.author.id,
                xp: 0,
                level: 0
            };
            await collection.insertOne(userXpData);
        }

        const randomnum = Math.floor(Math.random() * 6) + 5; //XP pro message
        userXpData.xp += randomnum;

        const curXp = userXpData.xp;
        const curLvl = userXpData.level;
        const nextLvl = curLvl * 200; // XP Für nächstes level

        if (nextLvl <= curXp) {
            userXpData.level += 1;
            const findrole = await findRoleIds(curLvl + 1); // Annahme: findRoleIds gibt die Rollen-ID zurück
            
            if (findrole) {
                    const role = message.guild.roles.cache.get(findrole); // Erhalte die Rolle anhand der ID
                    if (role) {
                        const user = message.guild.members.cache.get(message.author.id); // Erhalte das Mitglied, dem die Rolle zugewiesen werden soll
                        if (user) {
                            user.roles.add(role)
                                .catch((error) => {
                                    console.error('Fehler beim Hinzufügen der Rolle:', error);
                                });
                        } else {
                            console.error('Mitglied nicht gefunden.');
                        }
                    } else {
                        console.error('Rolle nicht gefunden.');
                    }
            } else {
                console.error('Keine passende Rolle gefunden.');
            }
            

            const embed = new EmbedBuilder()
                .setDescription(`<@${message.author.id}>, du bist nun Level **${curLvl + 1}**!`)
                .setColor('Orange');

            await message.channel.send({ embeds: [embed] });
        }

        await collection.updateOne({ guildId: message.guild.id, userId: message.author.id }, { $set: { xp: userXpData.xp, level: userXpData.level } });
    } catch (error) {
        console.error('Error handlich Bad Words:', error);
    }
};