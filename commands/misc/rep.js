const Command = require('#structures/Command')

class Reputation extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/misc/rep:description'),
      usage: language => language('commands/misc/rep:usage'),
      guildOnly: true,
      aliases: ['reputation']
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user)
    if (user.bot) return ctx.tr('commands/misc/rep:bot')
    if (user.id === ctx.author.id) return ctx.tr('commands/misc/rep:author')
    if (ctx.author.settings.repcooldown && Date.now() < ctx.author.settings.repcooldown) {
      return ctx.tr('commands/misc/rep:cooldown', { time: this.client.utils.getDuration(ctx.author.settings.repcooldown - Date.now()) })
    }
    await user.syncSettings()
    const reputation = user.settings.reputation + 1
    await user.update({ reputation })
    await ctx.author.update({ repcooldown: new Date(ctx.message.createdTimestamp + 43200000) })
    return ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/misc/rep:success', { user }))
  }
}

module.exports = Reputation
