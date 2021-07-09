const Command = require('#structures/Command')

class Prefix extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/config/prefix:description'),
      usage: language => language('commands/config/prefix:usage'),
      guildOnly: true,
      aliases: ['setprefix', 'changeprefix']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      return ctx.tr('commands/config/prefix:current', { prefix: ctx.guild.settings.prefix })
    }

    if (!ctx.member.permissions.has('MANAGE_GUILD')) {
      return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/prefix:noPerms'))
    }

    const prefix = args.join(' ')

    if (prefix === 'reset') return this.reset(ctx)
    if (prefix.length > 10) return ctx.errorMsg(ctx.translate('commands/config/prefix:tooLong'))
    if (prefix === ctx.guild.settings.prefix) return ctx.errorMsg(ctx.translate('commands/config/prefix:alreadyCurrent'))

    await ctx.guild.update({ prefix })
    return ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/prefix:updated', { prefix }))
  }

  async reset(ctx) {
    if (ctx.guild.settings.prefix === '|') return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/prefix:alreadyDefault'))
    await ctx.guild.update({ prefix: '|' })
    return ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/prefix:reset'))
  }
}

module.exports = Prefix
