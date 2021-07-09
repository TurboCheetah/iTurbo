const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Beautiful extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/beautiful:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/beautiful:usage')
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.beautiful(user.displayAvatarURL({ size: 256, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'beautiful.png'))
  }
}

module.exports = Beautiful
