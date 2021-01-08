const Command = require('../../structures/Command.js')
const c = require('@aero/centra')

class YearFact extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get a fact about a year or random year',
      cooldown: 5,
      usage: 'yearfact [year|random]',
      aliases: ['year', 'year-fact', 'yearfacts', 'year-facts']
    })
  }

  async run(ctx, [year = 'random']) {
    if (year !== 'random' && isNaN(parseInt(year))) return ctx.reply('Does that look like a year to you?')
    const text = await c(`http://numbersapi.com/${year}/year`).text()
    return ctx.reply(`**${text}**`)
  }
}

module.exports = YearFact
