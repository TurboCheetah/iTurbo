const Command = require('#structures/Command')
const c = require('@aero/centra')

class GIF extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/gif:description'),
      usage: language => language('commands/fun/gif:usage'),
      cooldown: 5
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.tr('commands/fun/gif:noArgs')

    const { data } = await c(`https://api.giphy.com/v1/gifs/search?api_key=${this.client.config.giphy}&limit=1&q=${encodeURIComponent(args.join(' '))}`).json()

    if (!data || !data[0]) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('common:noResults'))
    return ctx.reply(data[0].embed_url)
  }
}

module.exports = GIF
