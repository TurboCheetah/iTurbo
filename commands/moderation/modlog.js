const Command = require('#structures/Command')

class Modlog extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/modlog:description'),
      usage: language => language('commands/moderation/modlog:usage'),
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action && !ctx.guild.settings.modlog) return ctx.tr('common:correctUsage', { prefix: ctx.guild.prefix, usage: this.usage })
    if (!action) return ctx.tr('commands/moderation/modlog:current', { channel: this.client.channels.cache.get(ctx.guild.settings.modlog) })

    switch (action) {
      case 'disable':
        await ctx.guild.update({ modlog: null })
        ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/moderation/modlog:disabled'))
        break

      case 'enable': {
        if (!ctx.message.mentions.channels.size) return ctx.tr('commands/moderation/modlog:noChannel')
        const channel = ctx.message.mentions.channels.first()
        await ctx.guild.update({ modlog: channel.id })
        ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/moderation/modlog:enabled'))
        break
      }
      default:
        ctx.tr('common:correctUsage', { prefix: ctx.guild.prefix, usage: this.usage })
        break
    }
  }
}

module.exports = Modlog
