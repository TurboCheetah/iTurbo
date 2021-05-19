const Command = require('#structures/Command')

class Waifu extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Sends a randomly generated Waifu from thiswaifudoesnotexist.net',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    return ctx.reply(`https://www.thiswaifudoesnotexist.net/example-${Math.floor(Math.random() * 100000)}.jpg`)
  }
}

module.exports = Waifu
