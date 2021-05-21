const KSoftImageCommand = require('#structures/KSoftImageCommand')

class HAss extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'ass',
      cooldown: 5,
      cost: 15,
      nsfw: true
    }, ...args)
  }
}

module.exports = HAss
