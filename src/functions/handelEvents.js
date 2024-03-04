module.exports = (client) => {
  client.handleEvents = async (eventFiles, path) => {
      let loadedEvents = 0;

      for (const file of eventFiles) {
          try {
              const event = require(`../events/${file}`);
              if (event.once) {
                  client.once(event.name, (...args) => event.execute(...args, client));
              } else {
                  client.on(event.name, (...args) => event.execute(...args, client));
              }

              console.log(`Event loaded: ${event.name}`);
              loadedEvents++;
          } catch (error) {
              console.error(`Error loading event in file ${file}: ${error.message}`);
          }
      }

      console.log(`Total events loaded: ${loadedEvents}`);
  };
};
