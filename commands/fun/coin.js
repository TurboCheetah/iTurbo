const Command = require('#structures/Command')

class Coin extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('coinDescription'),
      extendedHelp: language => language.get('coinExtendedHelp'),
      usage: language => language.get('coinUsage'),
      aliases: ['coinflip', 'flipcoin'],
      cost: 5
    })
  }

  async run(ctx, [bet]) {
    if (bet && !['heads', 'tails'].includes(bet.toLowerCase())) {
      return ctx.reply(ctx.language.get('coinInvalidBet'))
    }

    const flipped = this.client.utils.random(['Heads', 'Tails'])

    if (bet && flipped.toLowerCase() === bet.toLowerCase()) {
      return ctx.reply(ctx.language.get('coinLandedBet', flipped))
    }

    return ctx.reply(ctx.language.get('coinLanded'))
  }
}

module.exports = Coin
