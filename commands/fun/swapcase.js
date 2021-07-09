const Command = require('#structures/Command')

class SwapCase extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/swapcase:description'),
      usage: language => language('commands/fun/swapcase:usage'),
      aliases: ['scase']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.tr('commands/fun/swapcase:noText')

    return ctx.reply(
      args.join(' ').replace(/\w/g, ch => {
        const up = ch.toUpperCase()
        return ch === up ? ch.toLowerCase() : up
      })
    )
  }
}

module.exports = SwapCase
