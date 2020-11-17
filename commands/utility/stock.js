const Command = require('../../structures/Command.js')
const yahooStockAPI = require('yahoo-stock-api')
const { MessageEmbed } = require('discord.js')

class Stock extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Get information about a certain stock.',
      aliases: [],
      usage: 'stock <stock>',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, [stock]) {
    const stockData = await yahooStockAPI.getSymbol(stock)

    if (!stockData.response) {
      return ctx.reply('Invalid stock!')
    }

    const embed = new MessageEmbed()
      .setTitle(`${stock.toUpperCase()}`)
      .setColor(0x9590EE)
      .addField('Previous Close', `$${stockData.response.previousClose.toLocaleString()}`, true)
      .addField('Open', `$${stockData.response.open.toLocaleString()}`, true)
      .addField('Bid', `$${stockData.response.bid.toLocaleString()}`, true)
      .addField('Ask', `$${stockData.response.ask.toLocaleString()}`, true)
      .addField('Today\'s Range', `$${stockData.response.dayRange}`, true)
      .addField('52 Week Range', `$${stockData.response.fiftyTwoWeekRange}`, true)
      .addField('Volume', `$${stockData.response.volume.toLocaleString()}`, true)
      .addField('Average Volume', `$${stockData.response.avgVolume.toLocaleString()}`, true)
      .addField('Market Cap', `$${stockData.response.marketCap.toLocaleString()}`, true)
      .addField('One Year Target', `$${stockData.response.oneYearTargetEst.toLocaleString()}`, true)
      .addField('Earnings Date', `${stockData.response.earningsDate}`, true)
    return ctx.reply({ embed })
  }
}

module.exports = Stock
