const Command = require('#structures/Command')

class LMGTFY extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/lmgtfy:description'),
      usage: language => language('commands/fun/lmgtfy:usage'),
      aliases: ['letmegooglethatforyou']
    })
  }

  async run(ctx, query) {
    const url = `https://lmgtfy.com/?q=${query.join(' ').replace(/ /g, '+')}`
    return ctx.reply(this.client.utils.random(ctx.translate('commands/fun/lmgtfy:responses'), url))
  }
}

module.exports = LMGTFY
