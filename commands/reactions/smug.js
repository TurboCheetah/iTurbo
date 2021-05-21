const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Smug extends NekosLifeCommand {
  constructor(...args) {
    super({ name: 'smug' }, ...args)
  }
}

module.exports = Smug
