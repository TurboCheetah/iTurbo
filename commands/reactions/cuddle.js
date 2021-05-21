const NekosLifeCommand = require('#structures/NekosLifeCommand')

class Cuddle extends NekosLifeCommand {
  constructor(...args) {
    super('cuddle', ...args, {
      usage: language => language.get('COMMAND_BAKA_USAGE'),
      guildOnly: true
    })
  }
}

module.exports = Cuddle
