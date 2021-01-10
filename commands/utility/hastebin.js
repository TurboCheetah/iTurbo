const Command = require('../../structures/Command.js')

class Hastebin extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['haste', 'hb'],
      description: 'Upload some code to hastebin.',
      usage: 'hastebin <code>',
      cooldown: 5
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to upload?')

    const { code, lang } = this.client.utils.getCodeBlock(ctx.rawArgs)

    const haste = await this.client.utils.haste(code, lang)

    return ctx.reply(`Hastebin-ified: ${haste}`)
  }
}

module.exports = Hastebin
