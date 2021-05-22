const Command = require('#structures/Command')
const c = require('@aero/centra')

class YearFact extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('yearfactDescription'),
      usage: language => language.get('yearfactUsage'),
      cooldown: 5,
      aliases: ['year', 'year-fact', 'yearfacts', 'year-facts']
    })
  }

  async run(ctx, [year = 'random']) {
    if (year !== 'random' && isNaN(parseInt(year))) return ctx.reply(ctx.language.get('yearfactNaN'))
    const text = await c(`http://numbersapi.com/${year}/year`).text()
    return ctx.reply(`**${text}**`)
  }
}

module.exports = YearFact
