const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Lizard extends NekosLifeCommand {
  constructor(...args) {
    super('lizard', ...args)
  }
}

module.exports = Lizard
