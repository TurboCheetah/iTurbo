const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Poke extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'poke',
      usage: language => language('pokeUsage'),
      guildOnly: true
    }, ...args)
  }
}

module.exports = Poke
