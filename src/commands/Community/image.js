const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('image')
    .setDescription('Lass dir von AI ein Bild generieren!')
    .addStringOption((o) =>
      o
        .setName('prompt')
        .setDescription('Beschreibe dein Bild')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { default: fetch } = await import('node-fetch');

    await interaction.deferReply();

    const prompt = interaction.options.getString('prompt');
    let imageURL = null;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-Prodia-Key': '73e1e95c-c57c-4c4d-8827-4a16f4cfbd52',
      },
      body: JSON.stringify({
        prompt: `${prompt}`,
      }),
    };

    fetch('https://api.prodia.com/v1/job', options)
      .then((response) => response.json())
      .then((jobResponse) => {
        const jobId = jobResponse.job;

        const options2 = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-Prodia-Key': '73e1e95c-c57c-4c4d-8827-4a16f4cfbd52',
          },
        };

        const checkJobStatus = async () => {
          fetch(`https://api.prodia.com/v1/job/${jobId}`, options2)
            .then((response) => response.json())
            .then(async (response) => {
              imageURL = response.imageUrl;

              if (imageURL) {
                // If imageURL is not null, create and send the embed
                const embed = new EmbedBuilder()
                  .setImage(`${imageURL}`)
                  .setTitle(`Generated Image!`)
                  .setDescription(`> **${prompt}**`)
                  .setColor('Random')
                  .setTimestamp();

                await interaction.followUp({ embeds: [embed]});
              } else {
                // If imageURL is still null, retry after a delay (e.g., 5 seconds)
                setTimeout(checkJobStatus, 5000);
              }
            })
            .catch((err) => console.error(err));
        };

        // Start checking the job status
        checkJobStatus();
      })
      .catch((err) => console.error(err));
  },
};
