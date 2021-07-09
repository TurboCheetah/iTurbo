const Command = require('#structures/Command')

class Enchant extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/enchant:description'),
      usage: language => language('commands/fun/enchant:usage'),
      aliases: ['enchantify']
    })
  }

  run(ctx, args) {
    if (!args.length) return ctx.tr('commands/fun/enchant:noArgs')
    return ctx.reply(args.join(' ').toLowerCase().replace(/a/gi, 'ᔑ').replace(/b/gi, 'ʖ').replace(/c/gi, 'ᓵ').replace(/d/gi, '↸').replace(/e/gi, 'ᒷ').replace(/f/gi, '⎓').replace(/g/gi, '⊣').replace(/h/gi, '⍑').replace(/i/gi, '╎').replace(/j/gi, '⋮').replace(/k/gi, 'ꖌ').replace(/l/gi, 'ꖎ').replace(/m/gi, 'ᒲ').replace(/n/gi, 'リ').replace(/o/gi, '𝙹').replace(/p/gi, '!¡').replace(/q/gi, 'ᑑ').replace(/r/gi, '∷').replace(/s/gi, 'ᓭ').replace(/t/gi, 'ℸ ̣').replace(/u/gi, '⚍').replace(/v/gi, '⍊').replace(/w/gi, '∴').replace(/x/gi, '·/').replace(/y/gi, '||').replace(/z/gi, '⨅'))
  }
}

module.exports = Enchant
