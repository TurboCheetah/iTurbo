const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Tickle extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'tickle',
      guildOnly: true
    }, ...args)
  }
}

module.exports = Tickle
