const Command = require('#structures/Command')

class Reverse extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('reverseDescription'),
      usage: language => language.get('reverseUsage'),
      aliases: ['rev']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply(ctx.language.get('reverseNoInput'))
    return ctx.reply(args.join(' ').split('').reverse().join(''))
  }
}

module.exports = Reverse
