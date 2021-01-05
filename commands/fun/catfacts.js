const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')

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
    const fact = await fetch('https://catfact.ninja/fact')
      .then(res => res.json())
      .then(({ fact }) => fact)

    return ctx.reply(`📢 **Catfact:** *${fact}*`)
  }
}

module.exports = CatFacts
