const Command = require('../../structures/Command.js')
const yahooStockAPI = require('yahoo-stock-api')
const { MessageEmbed } = require('discord.js')

class Stock extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get information about a certain stock.',
      cooldown: 3,
      usage: 'stock <stock>',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [stock]) {
    const stockData = await yahooStockAPI.getSymbol(stock)

    if (!stockData.response) {
      return ctx.reply('Invalid stock!')
    }

    const embed = new MessageEmbed()
      .setTitle(`${stock.toUpperCase()}`)
      .setColor(0x9590ee)
      .addField('Previous Close', stockData.response.previousClose ? `$${stockData.response.previousClose.toLocaleString()}` : 'No data available', true)
      .addField('Open', stockData.response.open ? `$${stockData.response.open.toLocaleString()}` : 'No data available', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Bid', stockData.response.bid ? `$${stockData.response.bid.toLocaleString()}` : 'No data available', true)
      .addField('Ask', stockData.response.ask ? `$${stockData.response.ask.toLocaleString()}` : 'No data available', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField("Today's Range", stockData.response.dayRange ? `$${stockData.response.dayRange}` : 'No data available', true)
      .addField('52 Week Range', stockData.response.fiftyTwoWeekRange ? `$${stockData.response.fiftyTwoWeekRange}` : 'No data available', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Volume', stockData.response.volume ? `$${stockData.response.volume.toLocaleString()}` : 'No data available', true)
      .addField('Average Volume', stockData.response.avgVolume ? `$${stockData.response.avgVolume.toLocaleString()}` : 'No data available', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Market Cap', stockData.response.marketCap ? `$${stockData.response.marketCap.toLocaleString()}` : 'No data available', true)
      .addField('One Year Target', stockData.response.oneYearTargetEst ? `$${stockData.response.oneYearTargetEst.toLocaleString()}` : 'No data available', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Earnings Date', stockData.response.earningsDate ? `${stockData.response.earningsDate}` : 'No data available', true)
    return ctx.reply({ embed })
  }
}

module.exports = Stock
