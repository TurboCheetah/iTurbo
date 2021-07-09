const Command = require('#structures/Command')

class Starboard extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/config/starboard:description'),
      extendedHelp: language => language('commands/config/starboard:extendedHelp'),
      usage: language => language('starboardUsage'),
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action, amount]) {
    switch (action) {
      case 'enable':
        if (!ctx.message.mentions.channels.size) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/starboard:specify'))
        await ctx.guild.update({ starboard: ctx.message.mentions.channels.first().id })
        ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/starBoard:enabled', { channel: ctx.message.mentions.channels.first() }))
        break
      case 'disable':
        await ctx.guild.update({ starboard: null })
        ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/starBoard:disabled'))
        break
      case 'limit':
        amount = this.verifyInt(amount)
        if (amount < 1) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/starboard:less'))
        if (amount > ctx.guild.memberCount) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/starboard:more'))
        await ctx.guild.update({ starboardLimit: amount })
        ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/starboard:limitUpdated', { amount }))
        break
      default:
        ctx.errorMsg(ctx.translate('common:error'), ctx.translate('common:correctUsage', { prefix: ctx.guild.prefix, usage: this.usage }))
        break
    }
  }
}

module.exports = Starboard
