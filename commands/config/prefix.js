const Command = require('#structures/Command')

class Prefix extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('prefixDescription'),
      usage: language => language.get('prefixUsage'),
      guildOnly: true,
      aliases: ['setprefix', 'changeprefix']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      return ctx.reply(ctx.language.get('prefixCurrent', ctx.guild.settings.prefix))
    }

    if (!ctx.member.permissions.has('MANAGE_GUILD')) {
      return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('prefixNoPerms'))
    }

    const prefix = args.join(' ')

    if (prefix === 'reset') return this.reset(ctx)
    if (prefix.length > 10) return ctx.errorMsg(ctx.language.get('prefixTooLong'))
    if (prefix === ctx.guild.settings.prefix) return ctx.errorMsg(ctx.language.get('prefixAlreadyCurrent'))

    await ctx.guild.update({ prefix })
    return ctx.successMsg(ctx.language.get('success'), ctx.language.get('prefixUpdated', prefix))
  }

  async reset(ctx) {
    if (ctx.guild.settings.prefix === '|') return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('prefixAlreadyDefault'))
    await ctx.guild.update({ prefix: '|' })
    return ctx.successMsg(ctx.language.get('success'), ctx.language.get('prefixReset'))
  }
}

module.exports = Prefix
