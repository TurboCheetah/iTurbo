const Command = require('#structures/Command')
const c = require('@aero/centra')

class OwOify extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('owoifyDescription'),
      usage: language => language.get('owoifyUsage'),
      cooldown: 3,
      aliases: ['owo']
    })
  }

  async run(ctx, args) {
    const text = args.join(' ')

    if (!text || text.length > 200) return ctx.reply('oopsie whoopsie you made a fucky wucky, no text or text over 200 characters')

    const { owo } = await c(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(text)}`).json()

    ctx.reply(owo)
  }
}

module.exports = OwOify
