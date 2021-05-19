const Command = require('#structures/Command')

class Reputation extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Give a reputation point to someone.',
      usage: 'rep <@user>',
      guildOnly: true,
      aliases: ['reputation']
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user)
    if (user.bot) return ctx.reply('Bots cannot earn reputation points.')
    if (user.id === ctx.author.id) return ctx.reply('You cannot give a reputation point to yourself.')
    if (ctx.author.settings.repcooldown && Date.now() < ctx.author.settings.repcooldown) {
      return ctx.reply(`You can give another reputation point in **${this.client.utils.getDuration(ctx.author.settings.repcooldown - Date.now())}**`)
    }
    await user.syncSettings()
    const reputation = user.settings.reputation + 1
    await user.update({ reputation })
    await ctx.author.update({ repcooldown: new Date(ctx.message.createdTimestamp + 43200000) })
    return ctx.reply(`${this.client.constants.emojis.success} Successfully gave a reputation point to ${user}`)
  }
}

module.exports = Reputation
