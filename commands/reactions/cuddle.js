const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Cuddle extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'cuddle',
      usage: language => language('cuddleUsage'),
      guildOnly: true
    }, ...args)
  }
}

module.exports = Cuddle
