const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Dipshit extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/dipshit:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/dipshit:usage')
    })
  }

  async run(ctx, args) {
    const user = await this.verifyUser(ctx, args[0], true).catch(() => args.join(' '))

    const text = user.username ? user.username : user

    const img = await this.client.img.dipshit(text)

    return ctx.reply(new MessageAttachment(img, 'dipshit.png'))
  }
}

module.exports = Dipshit
