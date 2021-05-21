const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Neko extends NekosLifeCommand {
  constructor(...args) {
    super({ name: 'neko' }, ...args)
  }
}

module.exports = Neko
