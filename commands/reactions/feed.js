const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Feed extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'feed',
      usage: language => language('feedUsage'),
      guildOnly: true
    }, ...args)
  }
}

module.exports = Feed
