const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Lizard extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'lizard',
      usage: language => language.get('pokeUsage')
    }, ...args)
  }
}

module.exports = Lizard
