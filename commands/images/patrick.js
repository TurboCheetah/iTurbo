const Command = require('../../structures/Command.js')
const { MessageAttachment } = require('discord.js')

class Patrick extends Command {
  constructor(...args) {
    super(...args, {
      description: 'WEEWOO WEEWOO',
      cooldown: 3,
      cost: 5,
      usage: 'patrick [@user]'
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.patrick(user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'patrick.png'))
  }
}

module.exports = Patrick
