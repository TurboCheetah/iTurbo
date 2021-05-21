const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Lick extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'lick',
      guildOnly: true
    }, ...args)
  }
}

module.exports = Lick
