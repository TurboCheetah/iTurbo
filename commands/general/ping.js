const Command = require('#structures/Command')

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/general/ping:description')
    })
  }

  async run(ctx) {
    const msg = await ctx.tr('commands/general/ping:message')

    return msg.edit(this.client.utils.random(ctx.translate('commands/general/ping:messages', { user: ctx.guild ? ctx.member.displayName : ctx.author.username, ms: msg.createdTimestamp - ctx.message.createdTimestamp })))
  }
}

module.exports = Ping
