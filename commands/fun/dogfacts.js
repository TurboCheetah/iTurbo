const Command = require('../../structures/Command.js')
const c = require('@aero/centra')

class DogFacts extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Gives you a random dog fact.',
      cooldown: 5
    })
  }

  async run(ctx) {
    const { facts } = await c('https://dog-api.kinduff.com/api/facts?number=1').json()
    return ctx.reply(`📢 **Dogfact:** *${facts}*`)
  }
}

module.exports = DogFacts
