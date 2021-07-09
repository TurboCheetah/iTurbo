const Command = require('#structures/Command')

class Reverse extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/reverse:description'),
      usage: language => language('commands/fun/reverse:usage'),
      aliases: ['rev']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.tr('commands/fun/reverse:noInput')
    return ctx.reply(args.join(' ').split('').reverse().join(''))
  }
}

module.exports = Reverse
