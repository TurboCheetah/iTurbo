const KSoftImageCommand = require('#structures/KSoftImageCommand')

class Hentai extends KSoftImageCommand {
  constructor(...args) {
    super({
      command: 'hentai',
      cooldown: 5,
      cost: 15,
      nsfw: true
    }, ...args)
  }
}

module.exports = Hentai
