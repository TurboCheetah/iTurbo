const Command = require('#structures/Command')
const c = require('@aero/centra')

class DogFacts extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/dogfacts:description'),
      cooldown: 5
    })
  }

  async run(ctx) {
    const { facts } = await c('https://dog-api.kinduff.com/api/facts?number=1').json()
    return ctx.tr('commands/fun/dogfacts:fact', { fact: facts })
  }
}

module.exports = DogFacts
