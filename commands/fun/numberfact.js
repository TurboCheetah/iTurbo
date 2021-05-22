const Command = require('#structures/Command')
const c = require('@aero/centra')

class NumberFact extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('numberfactDescription'),
      usage: language => language.get('numberfactUsage'),
      cooldown: 5,
      aliases: ['numfact', 'numfacts', 'num', 'number', 'number-fact', 'number-facts']
    })
  }

  async run(ctx, [number = 'random']) {
    if (number !== 'random' && isNaN(parseInt(number))) return ctx.reply(ctx.language.get('numberfactNaN'))
    const text = await c(`http://numbersapi.com/${number}`).text()
    return ctx.reply(`**${text}**`)
  }
}

module.exports = NumberFact
