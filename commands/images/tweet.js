const Command = require('../../structures/Command.js')
const { MessageAttachment } = require('discord.js')

class Tweet extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Tweet something as Trump.',
      cooldown: 3,
      cost: 5,
      usage: 'tweet <text>'
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to tweet?')

    const text = args.join(' ')

    if (text.length > 165) return ctx.reply('Text cannot be over 165 characters.')

    const img = await this.client.img.tweet(text)

    return ctx.reply(new MessageAttachment(img, 'tweet.png'))
  }
}

module.exports = Tweet
