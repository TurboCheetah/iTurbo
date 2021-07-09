const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Crush extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/crush:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/crush:usage')

    })
  }

  async run(ctx, [user, another]) {
    user = await this.verifyUser(ctx, user)
    another = await this.verifyUser(ctx, another, true)

    const img = await this.client.img.crush(user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }), another.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'crush.png'))
  }
}

module.exports = Crush
