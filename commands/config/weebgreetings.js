const Command = require('#structures/Command')

class WeebGreetings extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('weebgreetingsDescription'),
      usage: language => language.get('weebgreetingsUsage'),
      aliases: ['greetings'],
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('correctUsage', ctx.guild.prefix, this.usage))

    switch (action) {
      case 'enable':
        if (!ctx.message.mentions.channels.size) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('weebgreetingsSpecify'))
        await ctx.guild.update({ weebGreetings: ctx.message.mentions.channels.first().id })
        ctx.successMsg(ctx.language.get('success'), ctx.language.get('weebgreetingsEnabled'))
        break
      case 'disable':
        await ctx.guild.update({ weebGreetings: null })
        ctx.successMsg(ctx.language.get('success'), ctx.language.get('weebgreetingsDisabled'))
        break
      default:
        ctx.errorMsg(ctx.language.get('invalidAction'), ctx.language.get('weebgreetingsInvalid'))
        break
    }
  }
}

module.exports = WeebGreetings
