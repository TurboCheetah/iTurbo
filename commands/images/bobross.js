const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Bobross extends Command {
  constructor(...args) {
    super(...args, {
      description: "Let's paint a happy little tree.",
      cooldown: 3,
      cost: 5,
      usage: 'bobross [@user]'
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.bobross(user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'bobross.png'))
  }
}

module.exports = Bobross
