const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Spank extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'spank',
      guildOnly: true
    }, ...args)
  }
}

module.exports = Spank
