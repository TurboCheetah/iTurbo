const Command = require('#structures/Command')

class Waifu extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('COMMAND_WAIFU_DESCRIPTION'),
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    ctx.reply(`https://www.thiswaifudoesnotexist.net/example-${Math.floor(Math.random() * 100000)}.jpg`)
  }
}

module.exports = Waifu
