const Command = require('../../structures/Command.js')

class Reverse extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Reverses your text.',
      usage: 'reverse <text>',
      aliases: ['rev']
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to reverse?')
    return ctx.reply(args.join(' ').split('').reverse().join(''))
  }
}

module.exports = Reverse
