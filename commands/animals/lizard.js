const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Lizard extends NekosLifeCommand {
  constructor(...args) {
    super({ name: 'lizard' }, ...args)
  }
}

module.exports = Lizard
