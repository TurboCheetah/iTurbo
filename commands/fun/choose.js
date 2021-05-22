const Command = require('#structures/Command')

class Choose extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('chooseDescription'),
      extendedHelp: language => language.get('chooseExtendedHelp'),
      usage: language => language.get('chooseUsage'),
      aliases: ['choice', 'pick']
    })
  }

  async run(ctx, args) {
    const choices = args.join(' ').split(',')
    if (choices.length < 2) return ctx.reply('Not enough choices to pick from. Seperate your choices with a comma.')

    const msg = await ctx.reply(ctx.language.get('chooseThinking', this.client.constants.emojis.loading, this.client.user.username))

    await this.client.utils.sleep(Math.floor(Math.random() * 1500) + 1000)

    const choice = this.client.utils.random(choices)

    return msg.edit(ctx.language.get('chooseChoice', choice))
  }
}

module.exports = Choose
