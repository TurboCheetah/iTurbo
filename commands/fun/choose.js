const Command = require('#structures/Command')

class Choose extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/choose:description'),
      extendedHelp: language => language('commands/fun/choose:extendedHelp'),
      usage: language => language('chooseUsage'),
      aliases: ['choice', 'pick']
    })
  }

  async run(ctx, args) {
    const choices = args.join(' ').split(',')
    if (choices.length < 2) return ctx.tr('commands/fun/choose:noChoice')

    const msg = await ctx.tr('commands/fun/choose:thinking', { loading: this.client.constants.emojis.loading, user: this.client.user.username })

    await this.client.utils.sleep(Math.floor(Math.random() * 1500) + 1000)

    const choice = this.client.utils.random(choices)

    return msg.tr(ctx.translate('commands/fun/choose:choice', { choice, edit: true }))
  }
}

module.exports = Choose
