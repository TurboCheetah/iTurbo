const Command = require('../../structures/Command.js')
const yahooStockAPI  = require('yahoo-stock-api')
const { MessageEmbed } = require('discord.js')

class Stock extends Command {
  constructor (...args) {
    super(...args, {
      description: "Get information about a certain stock.",
      aliases: [],
      usage: 'stock <stock>'
    })
  }

  async run (ctx, [stock]) {
    const stockData = await yahooStockAPI.getSymbol(stock)

    const embed = new MessageEmbed()
      .setTitle(`${stock}`)
      .setColor(0x9590EE)
      .addField('Previous Close', `$${stockData.response.previousClose}`, true)
      .addField('Open', `$${stockData.response.open}`, true)
      .addField('Bid', `$${stockData.response.bid}`, true)
      .addField('Ask', `$${stockData.response.ask}`, true)
      .addField('Today\'s Range', `$${stockData.response.dayRange}`, true)
      .addField('52 Week Range', `$${stockData.response.fiftyTwoWeekRange}`, true)
      .addField('Volume', `$${stockData.response.volume}`, true)
      .addField('Average Volume', `$${stockData.response.avgVolume}`, true)
      .addField('Market Cap', `$${stockData.response.marketCap}`, true)
    return ctx.reply({ embed })
  }
}

module.exports = Stock
