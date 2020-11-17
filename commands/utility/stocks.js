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
    const stock = await yahooStockAPI.getSymbol(stock)
    console.log(stock);

/*     const embed = new MessageEmbed()
      .setTitle(`${ctx.guild.name}'s icon`)
      .setImage(ctx.guild.iconURL({ size: 2048 }))
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
    return ctx.reply({ embed }) */
  }
}

module.exports = Stocks
