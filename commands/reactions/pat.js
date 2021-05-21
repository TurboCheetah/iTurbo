const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Pat extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'pat',
      guildOnly: true
    }, ...args)
  }
}

module.exports = Pat
