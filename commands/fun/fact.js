const Command = require('#structures/Command')
const c = require('@aero/centra')

class Fact extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('factDescription'),
      aliases: ['facts', 'randomfact', 'randomfacts'],
      cooldown: 3
    })
  }

  async run(ctx) {
    const { fact } = await c('https://nekos.life/api/v2/fact').json()

    ctx.reply(fact)
  }
}

module.exports = Fact
