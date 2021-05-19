const Command = require('#structures/Command')
const c = require('@aero/centra')

class GIF extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Search a gif from giphy',
      usage: 'gif <query>',
      cooldown: 5
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to search?')

    const { data } = await c(`https://api.giphy.com/v1/gifs/search?api_key=${this.client.config.giphy}&limit=1&q=${encodeURIComponent(args.join(' '))}`).json()

    if (!data || !data[0]) return ctx.reply(`${this.client.constants.emojis.error} No results found.`)
    return ctx.reply(data[0].embed_url)
  }
}

module.exports = GIF
