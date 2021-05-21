const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Poke extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'poke',
      usage: language => language.get('pokeUsage'),
      guildOnly: true
    }, ...args)
  }
}

module.exports = Poke
