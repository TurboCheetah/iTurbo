const Command = require('#structures/Command')

class Say extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/say:description'),
      usage: language => language('commands/fun/say:usage'),
      aliases: ['echo', 'talk', 'repeat']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.tr('commands/fun/say:noText')
    if (ctx.message.deletable) await ctx.message.delete().catch(() => null)
    return ctx.reply(args.join(' '), { disableMentions: 'all' })
  }
}

module.exports = Say
