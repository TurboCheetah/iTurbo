const Command = require('../../structures/Command.js')
const c = require('@aero/centra')

class CatFacts extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['catfact', 'kittenfact'],
      cooldown: 3,
      cost: 10,
      description: 'Let me tell you a misterious cat fact.'
    })
  }

  async run(ctx) {
    const { fact } = await c('https://catfact.ninja/fact').json()

    return ctx.reply(`📢 **Catfact:** *${fact}*`)
  }
}

module.exports = CatFacts
