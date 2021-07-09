const Command = require('#structures/Command')
const c = require('@aero/centra')

class RandomGIF extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/randomgif:description'),
      usage: language => language('commands/fun/randomgif:usage'),
      aliases: ['rgif', 'randgif'],
      cooldown: 5
    })
  }

  async run(ctx, args) {
    let url = `https://api.giphy.com/v1/gifs/random?api_key=${this.client.config.giphy}`
    if (args.length) url += `&tag=${encodeURIComponent(args.join(' '))}`

    const body = await c(url).json()

    return ctx.reply(body.data.embed_url)
  }
}

module.exports = RandomGIF
