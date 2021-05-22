const Command = require('#structures/Command')
const c = require('@aero/centra')

class ChuckNorris extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('chucknorrisDescription'),
      usage: language => language.get('chucknorrisUsage'),
      aliases: ['chucknorrisjoke'],
      cooldown: 3
    })
  }

  async run(ctx, [user]) {
    if (user) user = await this.verifyUser(ctx, user)

    const { value } = await c('https://api.chucknorris.io/jokes/random').json()

    return ctx.reply(user ? value.replace(/Chuck Norris/g, user.toString()) : value)
  }
}

module.exports = ChuckNorris
