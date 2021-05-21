const NekosLifeCommand = require('#structures/NekosLifeCommand')

class AAvatar extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'avatar',
      extendedHelp: language => language.get('aavatarExtenedHelp')
    }, ...args)
  }
}

module.exports = AAvatar
