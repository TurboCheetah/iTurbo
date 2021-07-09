const Command = require('#structures/Command')
const c = require('@aero/centra')

class YearFact extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/yearfact:description'),
      usage: language => language('commands/fun/yearfact:usage'),
      cooldown: 5,
      aliases: ['year', 'year-fact', 'yearfacts', 'year-facts']
    })
  }

  async run(ctx, [year = 'random']) {
    if (year !== 'random' && isNaN(parseInt(year))) return ctx.tr('commands/fun/yearfact:nan')
    const text = await c(`http://numbersapi.com/${year}/year`).text()
    return ctx.reply(`**${text}**`)
  }
}

module.exports = YearFact
