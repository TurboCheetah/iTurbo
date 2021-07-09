const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Religion extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/religion:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/religion:usage')
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.religion(user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'religion.png'))
  }
}

module.exports = Religion
