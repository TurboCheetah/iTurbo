const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Kiss extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'kiss',
      guildOnly: true
    }, ...args)
  }
}

module.exports = Kiss
