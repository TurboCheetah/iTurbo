const Command = require('#structures/Command')

class RandomCase extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('randomcaseDescription'),
      usage: language => language.get('randomcaseUsage'),
      aliases: ['rcase']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply(ctx.language.get('randomcaseNoInput'))

    return ctx.reply(
      args.join(' ').replace(/\w/g, ch => {
        const fn = this.client.utils.random([ch.toUpperCase, ch.toLowerCase])
        return fn.apply(ch)
      })
    )
  }
}

module.exports = RandomCase
