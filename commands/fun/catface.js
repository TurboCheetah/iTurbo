const Command = require('../../structures/Command.js')
const c = require('@aero/centra')

class CatFace extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get a random cat face',
      aliases: ['catemoji'],
      cooldown: 3,
      cost: 3
    })
  }

  async run(ctx) {
    const { cat } = await c('https://nekos.life/api/v2/cat').json()

    return ctx.reply(cat)
  }
}

module.exports = CatFace
