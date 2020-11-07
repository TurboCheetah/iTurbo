const Command = require('../../structures/Command.js')
const { MessageAttachment } = require('discord.js')

class Beautiful extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Oh this. This is beautiful',
      cooldown: 3,
      cost: 5,
      usage: 'beautiful [@user]'
    })
  }

  async run (ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.beautiful(user.displayAvatarURL({ size: 256, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'beautiful.png'))
  }
}

module.exports = Beautiful
