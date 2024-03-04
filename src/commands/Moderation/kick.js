const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kickt ein Mitglied vom Server mit Bestätigung.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Das Mitglied das gekickt werden soll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Der Grund für den Kick")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("picture")
        .setDescription(
          "Sende ein Screenshot warum das Mitglied gekickt werden soll"
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const userToKick = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const picture = interaction.options.getAttachment("picture");

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    )
      return await interaction.reply({
        content:
          "❌ You must have the **Ban Members** permission to use this command!",
        ephemeral: true,
      });
    if (!userToKick)
      return await interaction.reply({
        content: "❌ The user mentioned is no longer within the server!",
        ephemeral: true,
      });

    if (interaction.member.id === userToKick.id)
      return interaction.reply({
        content: "❌ You cannot ban yourself!",
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle(`🔨 Kick Bestätigung`)
      .setDescription(
        `<@${interaction.user.id}> möchte <@${userToKick.id}> kicken.\n\n**Grund:** ${reason}\n\n*Der Kick ist unwiderruflich.*\nBitte bestätige unten ob der Kick ausgeführt werden soll.`
      )
      .setThumbnail(userToKick.displayAvatarURL())
      .addFields(
        { name: "User ID", value: userToKick.id, inline: true },
        {
          name: "Kick ausgeführt von",
          value: interaction.user.tag,
          inline: true,
        }
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
        .setCustomId("confirm_kick")
        .setLabel("Bestätigen")
        .setEmoji("✔️")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancel_kick")
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
        ["confirm_kick", "cancel_kick"].includes(i.customId) &&
        i.user.id === interaction.user.id
      );
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "confirm_kick") {
        await handleConfirmKick(i, userToKick, reason);
      } else if (i.customId === "cancel_kick") {
        await handleCancelKick(i);
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        interaction.editReply({
          content:
            "Ich habe keine Antwort erhalten. Der Kick wurde abgebrochen.",
          embeds: [],
          components: [],
        });
      }
    });
  },
};

async function handleConfirmKick(i, userToKick, reason) {
  try {
    const dmEmbed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle(`Du wurdest von ${i.guild.name} gekickt`)
      .setThumbnail(i.guild.iconURL())
      .addFields(
        { name: "Gekickt von", value: i.user.tag },
        { name: "Grund", value: reason }
      )
      .setTimestamp();

    await userToKick
      .send({ embeds: [dmEmbed] })
      .catch((error) =>
        console.error(
          `Ich konnte ${userToKick.tag} keine Privatnachricht schreiben.`,
          error
        )
      );

    const kickConfirmationEmbed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("Kick erfolgreich")
      .setDescription(`<@${userToKick.id}> wurde vom Server gekickt.`)
      .addFields({ name: "Grund", value: reason })
      .setTimestamp()
      .setFooter({
        text: `Gekickt von ${i.user.tag}`,
        iconURL: i.user.displayAvatarURL(),
      });

    await i.guild.members.kick(userToKick, {
      reason: `Gekickt von ${i.user.tag}: ${reason}`,
    });
    await i.reply({ content: "", embeds: [kickConfirmationEmbed] });
  } catch (error) {
    console.error(error);
    const errorEmbed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("Kick Error")
      .setDescription(
        `Ich konnte <@${userToKick.id}> nicht vom Server kicken.`
      )
      .setTimestamp()
      .setFooter({
        text: "Ein Fehler ist aufgetreten",
        iconURL: i.client.user.displayAvatarURL(),
      });
    await i.reply({ content: "", embeds: [errorEmbed] });
  }
}

async function handleCancelKick(i) {
  const cancelEmbed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle("Kick wurde abgebrochen")
    .setDescription("Die Aktion wurde abgebrochen.")
    .setTimestamp()
    .setFooter({
      text: `Abgebrochen von ${i.user.tag}`,
      iconURL: i.user.displayAvatarURL(),
    });

  await i.reply({ content: "", embeds: [cancelEmbed] });
}
