const Command = require('#structures/Command')

class ThanosQuote extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/thanosquote:description'),
      aliases: ['thanos']
    })
  }

  async run(ctx) {
    return ctx.reply(this.client.utils.random(ctx.translate('commands/fun/thanosquote:quotes')))
  }
}

module.exports = ThanosQuote
