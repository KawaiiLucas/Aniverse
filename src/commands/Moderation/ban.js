const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannt ein Mitglied vom Server")
    .addUserOption((option) =>
      option.setName("user").setDescription("Welches Mitglied gebannt werden soll").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Der Grund für den Bann")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("picture")
        .setDescription("Sende ein Bild dazu für den Bann")
        .setRequired(false)
    ),

  async execute(interaction) {
    const userToBan = interaction.options.getUser("user");
    const banMember = await interaction.guild.members.fetch(userToBan.id);
    const reason = interaction.options.getString("reason");
    const picture = interaction.options.getAttachment("picture");

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    )
      return await interaction.reply({
        content:
          "❌ You must have the **Ban Members** permission to use this command!",
        ephemeral: true,
      });
    if (!banMember)
      return await interaction.reply({
        content: "❌ The user mentioned is no longer within the server!",
        ephemeral: true,
      });
    if (!banMember.kickable)
      return await interaction.reply({
        content:
          "❌ I cannot ban this user because they are either higher than me or you!",
        ephemeral: true,
      });
    if (interaction.member.id === banMember.id)
      return interaction.reply({
        content: "❌ You cannot ban yourself!",
        ephemeral: true,
      });
    if (banMember.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({
        content:
          "❌ You cannot ban staff members or people with the Administrator permission!",
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle(`🔨 Ban Bestätigung`)
      .setDescription(
        `<@${interaction.user.id}> möchte <@${userToBan.id}> bannen.\n\nGrund: ${reason}\n\n*Diese Aktion ist unwiderruflich.*\nBitte bestätige oder breche die Aktion ab.`
      )
      .setThumbnail(userToBan.displayAvatarURL())
      .addFields(
        { name: "User ID", value: userToBan.id, inline: true },
        { name: "Ban ausgeführt von", value: interaction.user.tag, inline: true }
      )
      .setFooter({
        text: "Warte auf Reaktion.",
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    if (picture) {
      embed.setImage(picture.url);
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm_ban")
        .setLabel("Bestätigen")
        .setEmoji("✔️")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancel_ban")
        .setLabel("Abbrechen")
        .setEmoji("✖️")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const filter = (i) => {
      return (
        ["confirm_ban", "cancel_ban"].includes(i.customId) &&
        i.user.id === interaction.user.id
      );
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "confirm_ban") {
        await handleConfirmBan(i, userToBan, reason, picture);
      } else if (i.customId === "cancel_ban") {
        await handleCancelBan(i);
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        interaction.editReply({
          content: "Ich habe keine Reaktion erhalten. Der Bann wurde abgebrochen",
          embeds: [],
          components: [],
        });
      }
    });
  },
};

async function handleConfirmBan(i, userToBan, reason, picture) {
  try {
    const dmEmbed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle(`🚫 Du wurdest gebannt`)
      .setDescription(`Du wurdest von ${i.guild.name} gebannt.\n**Grund:** ${reason}`)
      .setThumbnail(i.guild.iconURL())
      .setTimestamp()
      .setFooter({
        text: `Gebannt von ${i.user.tag}`,
        iconURL: i.user.displayAvatarURL(),
      });

    if (picture) {
      dmEmbed.setImage(picture.url);
      dmEmbed.addFields({ name: "Screenshot:", value: "👇 Siehe unten 👇" });
    }

    await userToBan
      .send({ embeds: [dmEmbed] })
      .catch((error) =>
        console.error(`Ich konnte ${userToBan.tag} keine Privatnachricht senden.`, error)
      );

    const banConfirmationEmbed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("Bann erfolgreich")
      .setDescription(`<@${userToBan.id}> wurde vom Server gebannt.`)
      .addFields({ name: "Grund", value: reason })
      .setTimestamp()
      .setFooter({
        text: `Gebannt von ${i.user.tag}`,
        iconURL: i.user.displayAvatarURL(),
      });

    await i.guild.members.ban(userToBan, {
      reason: `Gebannt von ${i.user.tag}: ${reason}`,
    });
    await i.reply({ content: "", embeds: [banConfirmationEmbed] });
  } catch (error) {
    console.error(error);
    const errorEmbed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("Ban Error")
      .setDescription(`Ich konnte <@${userToBan.id}> nicht vom Server bannen.`)
      .setTimestamp()
      .setFooter({
        text: "Ein Fehler ist aufgetreten",
        iconURL: i.client.user.displayAvatarURL(),
      });
    await i.reply({ content: "", embeds: [errorEmbed] });
  }
}

async function handleCancelBan(i) {
  const cancelEmbed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle("Ban wurde abgebrochen")
    .setDescription("Die Aktion wurde abgebrochen.")
    .setTimestamp()
    .setFooter({
      text: `Abgebrochen von ${i.user.tag}`,
      iconURL: i.user.displayAvatarURL(),
    });

  await i.reply({ content: "", embeds: [cancelEmbed] });
}
