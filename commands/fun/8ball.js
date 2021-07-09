const Command = require('#structures/Command')

class EightBall extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/8ball:description'),
      usage: language => language('commands/fun/8ball:usage'),
      aliases: ['eightball', 'ball', 'magic8']
    })
  }

  async run(ctx, [question]) {
    if (!question) return ctx.tr('commands/fun/8ball:noQuestion')
    const msg = await ctx.tr('commands/fun/8ball:thinking', { loading: this.client.constants.emojis.loading })
    await this.client.utils.sleep(1500)
    return msg.edit(`**${this.client.utils.random(ctx.translate('commands/fun/8ball:responses'))}**`)
  }
}

module.exports = EightBall
