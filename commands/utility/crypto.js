const Command = require('../../structures/Command.js')
const axios = require('axios')
const { MessageEmbed } = require('discord.js')

class Crypto extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Gets information on the specified cryptocurrency',
      aliases: [],
      botPermissions: ['EMBED_LINKS'],
      usage: 'crypto [coin]',
      guildOnly: false,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx, args) {
    const options = {
      method: 'GET',
      url: 'https://api.nomics.com/v1/currencies/ticker',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json'
      }
    }

    if (!args.length) {
      options.params = {
        key: this.client.config.nomics,
        ids: 'BTC,ETH,XRP',
        interval: '1d'
      }

      const data = await axios.request(options).then(res => {
        return res.data
      }).catch(err => {
        console.error(err)
      })

      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setTitle('Current Crypto Prices')
        .addField(`Bitcoin (${data[0].symbol})`, `$${Number(data[0].price).toFixed(2)}`)
        .addField(`Ethereum (${data[1].symbol})`, `$${Number(data[1].price).toFixed(2)}`)
        .addField(`Ripple (${data[2].symbol})`, `$${Number(data[2].price).toFixed(2)}`)
        .setFooter(`Requested by: ${ctx.author.tag} • Powered by Nomics`, ctx.author.displayAvatarURL({ size: 32 }))
      return ctx.reply({ embed })
    }

    options.params = {
      key: this.client.config.nomics,
      ids: args[0].toUpperCase(),
      interval: '1h,1d,7d'
    }

    const data = await axios.request(options).then(res => {
      return res.data
    }).catch(err => {
      console.error(err)
    })

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(data[0].name, `https://icons.bitbot.tools/api/${args[0]}/128x128`)
      .addField('Price', `${Number(data[0].price).toFixed(2)}`)
      .addField('1H', `${Number(data[0]['1h'].price_change).toFixed(4)} (${Number(data[0]['1h'].price_change_pct).toFixed(4) * 100}%)`)
      .addField('24H', `${Number(data[0]['1d'].price_change).toFixed(4)} (${Number(data[0]['1d'].price_change_pct).toFixed(4) * 100}%)`)
      .addField('7D', `${Number(data[0]['7d'].price_change).toFixed(4)} (${Number(data[0]['7d'].price_change_pct).toFixed(4) * 100}%)`)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by Nomics`, ctx.author.displayAvatarURL({ size: 32 }))
    ctx.reply({ embed })
  }
}

module.exports = Crypto
