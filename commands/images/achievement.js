const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Achievement extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/achievement:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/achievement:usage')
    })
  }

  async run(ctx, [user, ...args]) {
    user = await this.verifyUser(ctx, user, true).catch(() => {
      args.unshift(user)
      return ctx.author
    })

    if (!args.length) return ctx.tr('common:noArgs')

    const text = args.join(' ')

    if (text.length > 21) return ctx.tr('common:exceedsLength', { length: 21 })

    const img = await this.client.img.achievement(user.displayAvatarURL({ size: 64, dynamic: true, format: 'png' }), text)

    return ctx.reply(new MessageAttachment(img, 'achievement.png'))
  }
}

module.exports = Achievement
