const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Color extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/color:description'),
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/color:usage'),
      aliases: ['colour']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.tr('commands/images/color:noColor')

    const img = await this.client.img.color(args.join(' ')).catch(err => {
      // Can't be bothered to make the input correct.
      // So just throw it to the API and report any validation errors.
      throw err.message
    })

    return ctx.reply(new MessageAttachment(img, 'color.png'))
  }
}

module.exports = Color
