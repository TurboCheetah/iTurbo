const Command = require('#structures/Command')

class SwapCase extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('swapcaseDescription'),
      usage: language => language.get('swapcaseUsage'),
      aliases: ['scase']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply(ctx.language.get('swapcaseNoText'))

    return ctx.reply(
      args.join(' ').replace(/\w/g, ch => {
        const up = ch.toUpperCase()
        return ch === up ? ch.toLowerCase() : up
      })
    )
  }
}

module.exports = SwapCase
