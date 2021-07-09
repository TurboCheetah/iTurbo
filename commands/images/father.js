const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Father extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/father:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/father:usage')
    })
  }

  async run(ctx, [user, ...args]) {
    user = await this.verifyUser(ctx, user, true).catch(() => {
      args.unshift(user)
      return ctx.author
    })

    if (!args.length) return ctx.tr('common:noArgs')

    const text = args.join(' ')

    if (text.length > 42) return ctx.tr('common:exceedsLength', { length: 42 })

    const img = await this.client.img.father(user.displayAvatarURL({ size: 256, dynamic: true, format: 'png' }), text)

    return ctx.reply(new MessageAttachment(img, 'father.png'))
  }
}

module.exports = Father
