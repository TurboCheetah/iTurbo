const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Headrub extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'headrub',
      aliases: ['rub'],
      guildOnly: true
    }, ...args)
  }
}

module.exports = Headrub
