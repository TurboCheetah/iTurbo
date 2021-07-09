const Command = require('#structures/Command')

class RandomCase extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/randomcase:description'),
      usage: language => language('commands/fun/randomcase:usage'),
      aliases: ['rcase']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.tr('commands/fun/randomcase:noInput')

    return ctx.reply(
      args.join(' ').replace(/\w/g, ch => {
        const fn = this.client.utils.random([ch.toUpperCase, ch.toLowerCase])
        return fn.apply(ch)
      })
    )
  }
}

module.exports = RandomCase
