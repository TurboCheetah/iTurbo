const KSoftImageCommand = require('#structures/KSoftImageCommand')

class LewdNeko extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'neko',
      aliases: ['lneko'],
      cooldown: 5,
      cost: 15,
      nsfw: true
    }, ...args)
  }
}

module.exports = LewdNeko
