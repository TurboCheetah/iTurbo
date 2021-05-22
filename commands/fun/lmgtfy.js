const Command = require('#structures/Command')

class LMGTFY extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('lmgtfyDescription'),
      usage: language => language.get('lmgtfyUsage'),
      aliases: ['letmegooglethatforyou']
    })
  }

  async run(ctx, query) {
    const url = `https://lmgtfy.com/?q=${query.join(' ').replace(/ /g, '+')}`
    return ctx.reply(this.client.utils.random(ctx.language.get('lmgtfyResponses'), url))
  }
}

module.exports = LMGTFY
