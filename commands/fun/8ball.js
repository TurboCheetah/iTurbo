const Command = require('#structures/Command')

class Eightball extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('eightBallDescription'),
      usage: language => language.get('eightBallUsage'),
      aliases: ['eightball', 'ball', 'magic8']
    })
  }

  async run(ctx, [question]) {
    if (!question) return ctx.reply(ctx.language.get('eightBallNoQuestion'))
    const msg = await ctx.reply(ctx.language.get('eightBallThinking', this.client.constants.emojis.loading))
    await this.client.utils.sleep(1500)
    return msg.edit(`**${this.client.utils.random(ctx.language.get('eightBallresponses'))}**`)
  }
}

module.exports = Eightball
