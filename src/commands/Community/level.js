const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const Canvas = require("canvas");
const { MongoClient } = require("mongodb");
require("dotenv").config();

let db;
let collection;

(async () => {
  try {
    const mongoClient = new MongoClient(process.env.mongoURL);
    await mongoClient.connect();
    db = mongoClient.db("xpbot");
    collection = db.collection("userXp");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Lässt dir deine oder die Rankcard eines Mitglieds anzeigen")
    .addMentionableOption((option) =>
      option
        .setName("user")
        .setDescription("Zeigt dein Level oder das eines Mitglieds")
        .setRequired(false)
    ),
  async execute(interaction) {
    const mentionable = interaction.options.getMentionable("user");

    if (mentionable) {
      var user = mentionable.user;
    } else {
      var user = interaction.user;
    }

    let userXpData = await collection.findOne({
      guildId: interaction.guild.id,
      userId: user.id,
    });

    if (!userXpData) {
      userXpData = {
        guildId: interaction.guild.id,
        userId: user.id,
        xp: 0,
        level: 0,
      };
      await collection.insertOne(userXpData);
    }

    const curXp = userXpData.xp;
    const curLvl = userXpData.level;
    const nextLvl = curLvl * 200;
    await collection.updateOne(
      { guildId: interaction.guild.id, userId: user.id },
      { $set: { xp: userXpData.xp, level: userXpData.level } }
    );

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    // draw path background image
    const backgroundImage = await Canvas.loadImage(
      "https://img.freepik.com/free-photo/abstract-smooth-orange-background-layout-design-studio-room-web-template-business-report-with-smooth-circle-gradient-color_1258-55988.jpg"
    ); // Hier den Pfad zum Bild einfÃ¼gen
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // draw user avatar
    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ format: "jpg" }).replace(/\.webp/g, ".png")
    );
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 25, 200, 200);
    ctx.restore();

    // draw user name
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textShadow = "2px 2px #000000";
    ctx.fillText(user.username, 250, 75);

    // draw XP and level text
    ctx.font = "32px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textShadow = "2px 2px #000000";
    ctx.fillText(`XP: ${curXp}/${nextLvl}`, 250, 125);
    ctx.fillText(`Level: ${curLvl}`, 250, 175);

    // draw progress bar
    ctx.fillStyle = "#555555";
    ctx.fillRect(250, 200, 400, 20);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(250, 200, (curXp / nextLvl) * 400, 20);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), "level.png");
    await interaction.reply({ files: [attachment] });
  },
};
