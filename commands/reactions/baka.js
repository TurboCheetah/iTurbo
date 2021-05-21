const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Baka extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'baka',
      usage: language => language.get('bakaUsage')
    }, ...args)
  }
}

module.exports = Baka
