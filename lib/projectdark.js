const config = require('./config');

module.exports = class Game {
  //Requires Guild from Discord API
  intialize(guild) {
    console.log('GUILD IN LIB');
    const categories = guild.channels.findAll('type', 'category');
    const hasCategory = categories.find(cat => cat.name === config.gameName);

    if (!hasCategory) {
      console.log('Setting up game on this server.');
      guild.createChannel(config.gameName, 'category').then(category => {
        config.gameCategoryChannels.forEach(channel => {
          guild.createChannel(channel.name, channel.type).then(helpChannel => {
            helpChannel.setParent(category.id);
            helpChannel.send(channel.defaultTextBody);
          });
        });
      });

      guild.createChannel(config.gameLobbyName, 'category').then(lobbiesCategory => {
        config.gameLobbyChannels.forEach(channel => {
          guild.createChannel(channel.name, channel.type).then(questsChannel => {
            questsChannel.setParent(lobbiesCategory.id);
            questsChannel.send(channel.defaultTextBody);
          });
        });
      });
      console.log('The Game has finished setup.');
    } else {
      console.log('The Game has been setup previously.');
    }
  }
};
