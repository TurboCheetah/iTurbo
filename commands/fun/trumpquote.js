const Command = require('#structures/Command')
const c = require('@aero/centra')

class TrumpQuote extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Returns a random Donald Trump quote.',
      cooldown: 3
    })
  }

  async run(ctx) {
    const { value } = await c('https://api.tronalddump.io/random/quote').json()
    return ctx.reply(value)
  }
}

module.exports = TrumpQuote
