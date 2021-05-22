const NekosLifeCommand = require('#structures/NekosLifeCommand')

class AAvatar extends NekosLifeCommand {
  constructor(...args) {
    super({
      name: 'avatar',
      description: language => language.get('aavatarDescription'),
      extendedHelp: language => language.get('aavatarExtenedHelp')
    }, ...args)
  }
}

module.exports = AAvatar
