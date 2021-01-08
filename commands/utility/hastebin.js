const Command = require('../../structures/Command.js')
const c = require('@aero/centra')

class Hastebin extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['hb'],
      description: 'Upload some code to hastebin.',
      usage: 'hastebin <code>',
      cooldown: 5
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to upload?')

    const { code, lang } = this.client.utils.getCodeBlock(ctx.rawArgs)

    const { key } = await c('https://haste.turbo.ooo/documents', 'POST')
      .body(code)
      .json()
      .catch(() => {
        throw 'Something went wrong with Hastebin. Try again later.'
      })

    return ctx.reply(`Hastebin-ified: https://haste.turbo.ooo/${key}${lang ? `.${lang}` : ''}`)
  }
}

module.exports = Hastebin
