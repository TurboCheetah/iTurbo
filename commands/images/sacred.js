const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Sacred extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/sacred:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/sacred:usage')
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.sacred(user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'sacred.png'))
  }
}

module.exports = Sacred
