const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Neko extends NekosLifeCommand {
  constructor(...args) {
    super('neko', ...args)
  }
}

module.exports = Neko
