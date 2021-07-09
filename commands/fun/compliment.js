const Command = require('#structures/Command')

class Compliment extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/compliment:description'),
      usage: language => language('commands/fun/compliment:usage')
    })
  }

  async run(ctx, [member]) {
    const user = await this.verifyUser(ctx, member, true)
    if (user.id === this.client.user.id) return ctx.tr('commands/fun/compliment:bot')
    return ctx.tr('commands/fun/compliment:compliment', { user, compliment: this.client.utils.random(ctx.translate('commands/fun/compliment:compliments')) })
  }
}

module.exports = Compliment
