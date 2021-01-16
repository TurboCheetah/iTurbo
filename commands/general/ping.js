const Command = require('../../structures/Command.js')

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Shows the network latency to Discord'
    })
  }

  async run(ctx) {
    const msg = await ctx.reply('Ping?')

    return msg.edit(
      this.client.utils
        .random(this.client.responses.pingMessages)
        .replace(/{{user}}/g, ctx.guild ? ctx.member.displayName : ctx.author.username)
        .replace(/{{ms}}/g, `${msg.createdTimestamp - ctx.message.createdTimestamp}`)
    )
  }
}

module.exports = Ping
