const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Picture extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/picture:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/picture:usage')
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.picture(user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'picture.png'))
  }
}

module.exports = Picture
