const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Delete extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/delete:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/delete:usage')
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const img = await this.client.img.delete(user.displayAvatarURL({ size: 256, dynamic: true, format: 'png' }))

    return ctx.reply(new MessageAttachment(img, 'delete.png'))
  }
}

module.exports = Delete
