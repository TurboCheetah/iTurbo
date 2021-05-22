const Command = require('#structures/Command')
const c = require('@aero/centra')

class YoMomma extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('yomommaDescription'),
      usage: language => language.get('yomommaUsage'),
      aliases: ['urmom'],
      cooldown: 3
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const { joke } = await c('https://api.yomomma.info').json()

    return ctx.reply(ctx.language.get('yomommaJoke', user, joke))
  }
}

module.exports = YoMomma
