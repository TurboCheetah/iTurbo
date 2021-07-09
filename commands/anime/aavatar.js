const NekosLifeCommand = require('#structures/NekosLifeCommand')

class AAvatar extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'avatar',
      description: language => language('commands/anime/aavatar:description'),
      extendedHelp: language => language('commands/anime/aavatar:extendedHelp')
    }, ...args)
  }
}

module.exports = AAvatar
