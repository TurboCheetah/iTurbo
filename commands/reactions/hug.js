const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Hug extends KSoftImageCommand {
  constructor(...args) {
    super({
      guildOnly: true
    }, ...args)
  }
}

module.exports = Hug
