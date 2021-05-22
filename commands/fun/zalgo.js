const Command = require('#structures/Command')

class Zalgo extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('zalgoDescription'),
      usage: language => language.get('zalgoUsage'),
      cost: 10
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply(ctx.language.get('zalgoNoArgumnent'))

    const text = args.join(' ')
    if (text.length > 180) return ctx.reply(ctx.language.get('zalgoCharLimit'))

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
