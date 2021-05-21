const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Baka extends NekosLifeCommand {
  constructor(...args) {
    super('baka', ...args, {
      usage: language => language.get('COMMAND_BAKA_USAGE')
    })
  }
}

module.exports = Baka
