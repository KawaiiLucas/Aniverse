const { ActivityType } = require("discord.js");
const cowsay = require("cowsay");
const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;


module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    function updateMemberCount() {
      const guildObj = client.guilds.cache.get('1090278417213161632'); // Ersetze mit deiner Server-ID

      if (!guildObj) {
        console.error('Guild ist undefined. Bot ist nicht auf dem Server?');
        return;
      }

      const memberCount = guildObj.memberCount;

      client.user.setActivity({
        name: `/help | ${memberCount} Mitglieder`,
        type: ActivityType.Watching
      });
    }

    updateMemberCount(); // Initial update

    // Set interval to update every 5 minutes (300,000 milliseconds)
    setInterval(updateMemberCount, 300000);

    console.log(
      cowsay.say({
        text: "Ich bin nun gestartet & bereit!",
        f: "cheese",
      })
    );

    if (!mongoURL) return;

    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoURL || '', {
      // Entferne useNewUrlParser
      // Entferne useUnifiedTopology
    });

    if (mongoose.connection.readyState === 1) {
      console.log('Connected to MongoDB');
    } else {
      console.log('I cannot connect to the database right now...');
    }
  },
};