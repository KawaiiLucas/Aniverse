const{ SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const apiKey = "39154bc3de8d726392db832e43bc2031";
const imperialUrl = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q='
const metricUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='
const unsplashUrl = 'https://source.unsplash.com/512x512/?'
const imageUrl = "https://www.openweathermap.org/img/wn/"
let response = ''
let degree = ''
let lengthUnit = ''
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('wetter')
    .setDescription('Zeigt dir das Wetter einer Stadt an')
    .addStringOption(option => option.setName('city').setDescription('put the city you want to display weather from').setRequired(true))
    .addStringOption(option => option.setName('unit-system').setDescription('Do you want imperial or metric?').setRequired(true).addChoices({name: 'Metric', value: 'metric'}, {name: 'Imperial', value: 'imperial'})),
    async execute(interaction, client) {
        const cityName = interaction.options.getString('city')
        const unitSystem = interaction.options.getString('unit-system')
        if(unitSystem == 'imperial'){
            response = await fetch(imperialUrl + cityName + `&appId=${apiKey}`);
            degree = '°F';
            lengthUnit = 'mph';
        }
        else if(unitSystem == 'metric'){
            response = await fetch(metricUrl + cityName + `&appId=${apiKey}`);
            degree = '°C';
            lengthUnit = 'm/s';
        }
        var data2 = await response.json();
        cityNameNoSpace = cityName.replace(/\s/g, '');
        
        
        const embed = new EmbedBuilder()
            .setTitle(`Das Wetter in ${cityName}:`)
            .setThumbnail(imageUrl+data2.weather[0].icon+'.png')
            .setImage(unsplashUrl+cityNameNoSpace)
            .addFields([
                {
                    name: 'Wetter',
                    value:`${data2.weather[0].main}`,
                    inline: true
                },
                {
                    name: 'Beschreibung',
                    value: `${data2.weather[0].description}`,
                    inline: true
                },
                {
                    name: 'Temperatur',
                    value: `${data2.main.temp} ${degree}`,
                    inline: true
                },
                {
                    name: 'Feuchtigkeit',
                    value: `${data2.main.humidity}%`
                },
                {
                    name: 'Wind Geschwindigkeit',
                    value: `${data2.wind.speed} ${lengthUnit}`
                }
            ])
        await interaction.reply({
            embeds: [embed]
        })
    }
}