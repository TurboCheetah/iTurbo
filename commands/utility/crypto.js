const Command = require('../../structures/Command.js')
const axios = require('axios')
const { MessageEmbed } = require('discord.js')

class Crypto extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Gets information on the specified cryptocurrency',
      aliases: [],
      botPermissions: ['EMBED_LINKS'],
      usage: 'crypto [coin] [fiat]',
      guildOnly: false,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, [coin, fiat = 'USD']) {
    const toFixedNum = (num, precision) => {
      return Number((+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision))
    }

    const options = {
      method: 'GET',
      url: 'https://api.nomics.com/v1/currencies/ticker',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json'
      }
    }

    if (!coin) {
      options.params = {
        key: this.client.config.nomics,
        ids: 'BTC,ETH,XRP',
        interval: '1d'
      }

      const data = await axios
        .request(options)
        .then(res => {
          return res.data
        })
        .catch(err => {
          console.error(err)
        })

      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle('Current Crypto Prices')
        .addField(`Bitcoin (${data[0].symbol})`, `$${toFixedNum(Number(data[0].price), 2).toLocaleString()} USD`, true)
        .addField(`Ethereum (${data[1].symbol})`, `$${toFixedNum(Number(data[1].price), 2).toLocaleString()} USD`, true)
        .addField(`Ripple (${data[2].symbol})`, `$${toFixedNum(Number(data[2].price), 2).toLocaleString()} USD`, true)
        .setFooter(`Requested by: ${ctx.author.tag} • Powered by Nomics`, ctx.author.displayAvatarURL({ size: 32 }))
      return ctx.reply({ embed })
    }

    options.params = {
      key: this.client.config.nomics,
      ids: coin.toUpperCase(),
      interval: '1h,1d,7d',
      convert: fiat.toUpperCase()
    }

    const data = await axios
      .request(options)
      .then(res => {
        return res.data
      })
      .catch(err => {
        console.error(err)
      })

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(data[0].name, `https://icons.bitbot.tools/api/${coin}/128x128`)
      .addField('Price', `$${toFixedNum(Number(data[0].price), 2).toLocaleString()} ${fiat.toUpperCase()}`, true)
      .addField('Market Cap', `$${toFixedNum(Number(data[0].market_cap), 2).toLocaleString()}`, true)
      .addField('Circulating Supply', `${toFixedNum(Number(data[0].circulating_supply), 2).toLocaleString()}`, true)
      .addField('1H', `$${toFixedNum(Number(data[0]['1h'].price_change), 4).toLocaleString()} (${toFixedNum(Number(data[0]['1h'].price_change_pct) * 100, 2)}%)`, true)
      .addField('24H', `$${toFixedNum(Number(data[0]['1d'].price_change), 4).toLocaleString()} (${toFixedNum(Number(data[0]['1d'].price_change_pct) * 100, 2)}%)`, true)
      .addField('7D', `$${toFixedNum(Number(data[0]['7d'].price_change), 4).toLocaleString()} (${toFixedNum(Number(data[0]['7d'].price_change_pct) * 100, 2)}%)`, true)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by Nomics`, ctx.author.displayAvatarURL({ size: 32 }))
    ctx.reply({ embed })
  }
}

module.exports = Crypto
