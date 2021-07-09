const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Patrick extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/patrick:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/patrick:usage')
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.patrick(user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'patrick.png'))
  }
}

module.exports = Patrick
