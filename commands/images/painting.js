const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Painting extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/painting:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/painting:usage')

    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.painting(user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'painting.png'))
  }
}

module.exports = Painting
