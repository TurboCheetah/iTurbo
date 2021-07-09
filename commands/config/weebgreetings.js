const Command = require('#structures/Command')

class WeebGreetings extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/config/weebgreetings:description'),
      usage: language => language('commands/config/weebgreetings:usage'),
      aliases: ['greetings'],
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('common:correctUsage', { prefix: ctx.guild.prefix, usage: this.usage }))

    switch (action) {
      case 'enable':
        if (!ctx.message.mentions.channels.size) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/weebgreetings:specify'))
        await ctx.guild.update({ weebGreetings: ctx.message.mentions.channels.first().id })
        ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/weebgreetings:enabled', { channel: ctx.message.mentions.channels.first() }))
        break
      case 'disable':
        await ctx.guild.update({ weebGreetings: null })
        ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/weebgreetings:disabled'))
        break
      default:
        ctx.errorMsg(ctx.translate('common:invalidAction'), ctx.translate('commands/config/weebgreetings:invalid'))
        break
    }
  }
}

module.exports = WeebGreetings
