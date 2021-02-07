const Command = require('../../structures/Command.js')
const c = require('@aero/centra')

class YoMomma extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Yo momma so fat.',
      aliases: ['urmom'],
      cooldown: 3,
      usage: 'yomomma [@user]'
    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const { joke } = await c('https://api.yomomma.info').json()

    return ctx.reply(`${user}, ${joke}`)
  }
}

module.exports = YoMomma
