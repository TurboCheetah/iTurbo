const NekosLifeCommand = require('#structures/NekosLifeCommand')

class AAvatar extends NekosLifeCommand {
  constructor(...args) {
    super('avatar', ...args, {
      extendedHelp: language => language.get('COMMAND_AAVATAR_EXTENDEDHELP')
    })
  }
}

module.exports = AAvatar
