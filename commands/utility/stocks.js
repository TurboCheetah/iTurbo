const Command = require('../../structures/Command.js')
const yahooStockAPI  = require('yahoo-stock-api')
const { MessageEmbed } = require('discord.js')

class Stocks extends Command {
  constructor (...args) {
    super(...args, {
      description: "Get information about a certain stock.",
      aliases: [],
      usage: 'stock <stock>'
    })
  }

  async run (ctx, [stock]) {
    const stockData = await yahooStockAPI.getSymbol(stock)
    console.log(stockData);

    const embed = new MessageEmbed()
      .setTitle(`${stock}`)
      .setColor(0x9590EE)
      .addField('Previous Close', stockData.previousClose, true)
      .addField('Open', stockData.open, true)
      .addField('Bid', stockData.bid, true)
      .addField('Ask', stockData.ask, true)
      .addField('Today\'s Range', stockData.dayRange, true)
      .addField('52 Week Range', stockData.fiftyTwoWeekRange, true)
      .addField('Volume', stockData.volume, true)
      .addField('Average Volume', stockData.avgVolume, true)
      .addField('Market Cap', stockData.marketCap, true)
    return ctx.reply({ embed })
  }
}

module.exports = Stocks
