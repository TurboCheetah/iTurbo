const Command = require('#structures/Command')

class Coin extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/coin:description'),
      extendedHelp: language => language('commands/fun/coin:extendedHelp'),
      usage: language => language('commands/fun/coin:usage'),
      aliases: ['coinflip', 'flipcoin'],
      cost: 5
    })
  }

  async run(ctx, [bet]) {
    if (bet && !['heads', 'tails'].includes(bet.toLowerCase())) {
      return ctx.tr('commands/fun/coin:invalidBet')
    }

    const flipped = this.client.utils.random(['Heads', 'Tails'])

    if (bet && flipped.toLowerCase() === bet.toLowerCase()) {
      return ctx.tr('commands/fun/coin:landedBet', { flipped })
    }

    return ctx.tr('commands/fun/coin:landed', { flipped })
  }
}

module.exports = Coin
