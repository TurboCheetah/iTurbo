const Command = require('#structures/Command')

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('pingDescription')
    })
  }

  async run(ctx) {
    const msg = await ctx.reply(ctx.language.get('pingMessage'))

    return msg.edit(
      this.client.utils
        .random(this.client.responses.pingMessages)
        .replace(/{{user}}/g, ctx.guild ? ctx.member.displayName : ctx.author.username)
        .replace(/{{ms}}/g, `${msg.createdTimestamp - ctx.message.createdTimestamp}`)
    )
  }
}

module.exports = Ping
