const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Sendet das Help Menu'),
  async execute(interaction) {
    if (!interaction.guild) return
    if (interaction.commandName === "help") {
      // Create the select menu
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help-menu')
        .setPlaceholder('Wähle ein Thema aus...')
        .addOptions([
          { label: 'Level System', value: 'level', emoji: "💼" },
          { label: 'Profil System', value: 'profil', emoji: "📄" },
          { label: 'Admin Commands', value: 'admin', emoji: "❗" },
        ]);
  
      // Create the action row with the select menu
      const actionRow = new ActionRowBuilder()
        .addComponents(selectMenu);
  
      // Send the initial message with the select menu
      const helpEmbed = new EmbedBuilder()
        .setTitle('Help Menu')
        .setDescription('❓ Das Help Menu zeigt dir einige Befehle an und ist dafür da dir die **Befehle** ein wenig übersichtlicher darzustellen.\n❗ Beachte dass das Help Menu sich im Moment noch im Aufbau befindet, und somit noch nicht alle Befehle von Aniverse hier zu finden sind.')
        .setImage('https://media.discordapp.net/attachments/1184440284264804442/1192419560696057937/Titelloses_67_20240104114904.png?ex=65a90241&is=65968d41&hm=8956a370f577a1166a99c3b4849a8342362e91fd28645104500110f196676b55&=&format=webp&quality=lossless')
        .setColor('Orange');
  
      const response = await interaction.reply({
        embeds: [helpEmbed],
        components: [actionRow]
      });
  
      // Create a filter to ensure only the interaction author can interact with the menu
      const collectorFilter = i => i.user.id === interaction.user.id;
  
      // Create a collector for the select menu
      const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });
  
      // Handle the user's selection
      collector.on('collect', async (interaction) => {
        const newValue = interaction.values[0];
        let newerEmbed;
  
        switch (newValue) {
          case 'level':
            newerEmbed = new EmbedBuilder()
            .setTitle('🎭 Level System Help')
            .setDescription('Auf unserem Server kannst du durch verschiedene Aktivitäten Erfahrungspunkte sammeln und somit in Leveln aufsteigen. Für das Erreichen bestimmter Level gibt es es dazugehörige Rollen.')
            .addFields({ name: 'Level-Rollen', value: 'Level **5**: <@&1092925708508090378>\nLevel **10**: <@&1092927216708493342>\nLevel **15**: <@&1099230249440509982>\nLevel **20**: <@&1099230610335207444>\nLevel **25**: <@&1099231698371235883>\nLevel **30**: <@&1176894819352727684>\nLevel **35**: <@&1099230805647175740>\nLevel **40**: <@&1176895265748291678>\nLevel **45**: <@&1099231137747972107>\nLevel **50**: <@&1176896429873189005>\nLevel **55**: <@&1176897041239126067>\nLevel **60**: <@&1099231385052520468>\n Level **65**: <@&1176897364015980575>\nLevel **70**: <@&1176898286599274618>\nLevel **75**: <@&1176898825647034388>\nLevel **80**: <@&1176900162375917692>\nLevel **85**: <@&1176902485357645906>\nLevel **90**: <@&1176899506990743602>\nLevel **95**: <@&1176901397153849425>\nLevel **100**: <@&1092927657005555882>'})
            .setImage('https://media.discordapp.net/attachments/1184440284264804442/1192405306655899649/Titelloses_67_20240104105232.png?ex=65a8f4fa&is=65967ffa&hm=2ea089f1af1ecd5d18347364e230acef8989dc65d16b1e6776ef5a7895ee4525&=&format=webp&quality=lossless')
            .setColor('Orange');
            break;
          case 'profil':
            newerEmbed = new EmbedBuilder()
            .setTitle('👥 Profile System Help')
            .setDescription('Auf unserem Server kannst du dir ein Profil erstellen was sich andere anschauen können, in diesem Profil kannst du einige Informationen über dich mit unserer Community teilen. Beachte dass das Ausnutzen dieses Systems für andere Zwecke zu einem **permanenten** Ausschluss aus dem Server führen kann.')
            .addFields({ name: '❓ Wie das Profil System funktioniert - und wie du es verwendest', value: 'Mit `/profil` kannst du dir dein Profil oder das eines anderen Mitglieds anschauen.\nMit `/profil-edit` kannst du dein eigenes Profil erstellen und bearbeiten.' })
            .setImage('https://media.discordapp.net/attachments/1184440284264804442/1192167909691232366/Titelloses_67_20240103190931.png?ex=65a817e3&is=6595a2e3&hm=4c097e1b4c650212163f17fcd6c8594fcbc110cbc4d062b569b7183741841a04&=&format=webp&quality=lossless')
            .setColor('Orange');
            break;
          case 'admin':
            newerEmbed = new EmbedBuilder()
            .setTitle('⚙ Admin Commands Help')
            .setDescription('Hier findest du alle Befehle womit du diesen Server verwalten kannst.')
            .addFields({ name: '🔨 Moderation', value: '`/autorole`\nVergibt eine Rolle an alle Mitglieder\n`/clear`\nLöscht eine gewisse Anzahl an Nachrichten\n`/dm`\nDer Bot verschickt eine Nachricht an ein Mitglied\n**Dies waren nur einige Befehle, in Zukunft wird hier mehr zu sehen sein!' })
            .setImage('https://media.discordapp.net/attachments/1184440284264804442/1192414113255673947/Titelloses_67_20240104112738.png?ex=65a8fd2e&is=6596882e&hm=9611f0b41e6a6bcc5dc90c8a9802f413ed56a5fe05d4fd9c51c4da3e07d13c7c&=&format=webp&quality=lossless')
            .setColor('Orange');
            break;
          default:
            // This should never happen, but just in case...
            return;
        }
  
        // Update the help menu message with the new embed
        await interaction.update({ embeds: [newerEmbed] });
      });
  
      // Handle any errors or timeouts
      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          console.log('Help menu collector timed out.');
        } else {
          console.log('Help menu collector ended for reason:', reason);
        }
      });
    }
  },
};
