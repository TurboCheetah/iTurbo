const Command = require('#structures/Command')

class Zalgo extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Convert text to zalgo text.',
      usage: 'zalgo <text>',
      cost: 10
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply('You must give me an argument!')

    const text = args.join(' ')
    if (text.length > 180) return ctx.reply('Cannot use more than 180 characters. While the Discord limit is 2000 characters the zalgo characters also add up extra characters. 180 characters is in fact already 1980 characters with this command.')

    return ctx.reply(
      text
        .split('')
        .map(c => {
          if (/\s/.test(c)) return c

          let zalgo = c

          for (let i = 0; i < 10; i++) {
            zalgo = zalgo + String.fromCharCode(Math.floor(Math.random() * 112) + 768)
          }

          return zalgo
        })
        .join('')
    )
  }
}

module.exports = Zalgo
