const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Poke extends NekosLifeCommand {
  constructor(...args) {
    super('poke', ...args, {
      usage: language => language.get('COMMAND_POKE_USAGE'),
      guildOnly: true
    })
  }
}

module.exports = Poke
