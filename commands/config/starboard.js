const Command = require('#structures/Command')

class Starboard extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('starboardDescription'),
      extendedHelp: language => language.get('starboardExtendedHelp'),
      usage: language => language.get('starboardUsage'),
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action, amount]) {
    switch (action) {
      case 'enable':
        if (!ctx.message.mentions.channels.size) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('starboardSpecify'))
        await ctx.guild.update({ starboard: ctx.message.mentions.channels.first().id })
        ctx.successMsg(ctx.language.get('success'), ctx.language.get('starBoardEnabled', ctx.message.mentions.channels.first()))
        break
      case 'disable':
        await ctx.guild.update({ starboard: null })
        ctx.successMsg(ctx.language.get('success'), ctx.language.get('starBoardDisabled'))
        break
      case 'limit':
        amount = this.verifyInt(amount)
        if (amount < 1) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('starboardLess'))
        if (amount > ctx.guild.memberCount) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('starboardMore'))
        await ctx.guild.update({ starboardLimit: amount })
        ctx.successMsg(ctx.language.get('success'), ctx.language.get('starboardLimitUpdated', amount))
        break
      default:
        ctx.errorMsg(ctx.language.get('error'), ctx.language.get('correctUsage', ctx.guild.prefix, this.usage))
        break
    }
  }
}

module.exports = Starboard
