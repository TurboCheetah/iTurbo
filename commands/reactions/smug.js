const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Smug extends NekosLifeCommand {
  constructor(...args) {
    super('smug', ...args)
  }
}

module.exports = Smug
