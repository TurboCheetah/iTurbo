const Command = require('#structures/Command')
const c = require('@aero/centra')

class YoMomma extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/yomomma:description'),
      usage: language => language('commands/fun/yomomma:usage'),
      aliases: ['urmom'],
      cooldown: 3
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const { joke } = await c('https://api.yomomma.info').json()

    return ctx.tr('commands/fun/yomomma:joke', { user, joke })
  }
}

module.exports = YoMomma
