const Command = require('#structures/Command')
const c = require('@aero/centra')

class GIF extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('gifDescription'),
      usage: language => language.get('gifUsage'),
      cooldown: 5
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply(ctx.language.get('gifNoArgs'))

    const { data } = await c(`https://api.giphy.com/v1/gifs/search?api_key=${this.client.config.giphy}&limit=1&q=${encodeURIComponent(args.join(' '))}`).json()

    if (!data || !data[0]) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('noResults'))
    return ctx.reply(data[0].embed_url)
  }
}

module.exports = GIF
