const Command = require('#structures/Command')

class Say extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('sayDescription'),
      usage: language => language.get('sayUsage'),
      aliases: ['echo', 'talk', 'repeat']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply(ctx.language.get('sayNoText'))
    if (ctx.message.deletable) await ctx.message.delete().catch(() => null)
    return ctx.reply(args.join(' '), { disableMentions: 'all' })
  }
}

module.exports = Say
