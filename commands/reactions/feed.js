const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Feed extends NekosLifeCommand {
  constructor(...args) {
    super('feed', ...args, {
      usage: language => language.get('COMMAND_FEED_USAGE'),
      guildOnly: true
    })
  }
}

module.exports = Feed
