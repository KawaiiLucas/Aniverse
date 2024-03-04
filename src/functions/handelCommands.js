const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const clientId = '1198717459390271539'; 
const guildId = '1090278417213161632'; 

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        let loadedCommands = 0;

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                try {
                    const command = require(`../commands/${folder}/${file}`);
                    client.commands.set(command.data.name, command);
                    client.commandArray.push(command.data.toJSON());

                    console.log(`Command loaded: ${command.data.name}`);
                    loadedCommands++;
                } catch (error) {
                    console.error(`Error loading command in file ${file}: ${error.message}`);
                    console.error(`Full Error:\n${error}`)
                }
            }
        }

        console.log(`Total commands loaded: ${loadedCommands}`);

        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);

        (async () => {
            try {
                console.log(`Started refreshing application (/) commands. Loaded ${loadedCommands} command(s).`);

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(`Error refreshing application (/) commands: ${error.message}`);
            }
        })();
    };
};

