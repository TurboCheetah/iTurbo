const Command = require('#structures/Command')
const c = require('@aero/centra')

class CatFacts extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('catfactsDescription'),
      aliases: ['catfact', 'kittenfact'],
      cooldown: 3,
      cost: 10
    })
  }

  async run(ctx) {
    const { fact } = await c('https://catfact.ninja/fact').json()

    return ctx.reply(`📢 **Catfact:** *${fact}*`)
  }
}

module.exports = CatFacts
