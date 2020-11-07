const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const { MessageEmbed } = require('discord.js')

class HentaiList extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Search for hentai on HentaiList',
      usage: 'hentailist <hentai>',
      aliases: ['hl', 'hlist'],
      cooldown: 5,
      cost: 5,
      nsfw: true
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to search for?')
    var args = args.join('-').toString().split('-')[0]

    const hentailist = async (id) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      var data = await fetch(`https://hentailist.turbo.ooo/api/hentai/${encodeURIComponent(id)}`, {
        signal: controller.signal
      }).then((r) => r.ok ? r.json() : '')
      clearTimeout(timeout)

      if (!data || data.invalid == true) return ctx.reply('No results found.')

      var tags = []
      for (var i = 0; i < data.tags.length; i++) {
        tags[i] = data.tags[i]
      }

      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setTitle(data.name)
        .setURL(data.url)
        .setThumbnail(data.cover_url)
        .setImage(data.poster_url)
        .addField('Description', data.description ? this.client.utils.shorten(data.description.replace(/(<([^>]+)>)/ig, '').replace(/\/r/g, '').replace(/\/n/g, '')) : 'No description given.')
        .addField('Release Date', data.released_at, true)
        .addField('Producer', data.brand, true)
        .addField('Censored', this.client.utils.toProperCase(data.is_censored.toString()), true)
        .addField('Views', data.views, true)
        .addField('Likes', data.likes, true)
        .addField('Interests', data.interests, true)
        .addField('Tags', `\`\`\`${tags.join(', ')}\`\`\``)
        .setFooter(`ID: ${data.id} | Requested by: ${ctx.author.tag} • Powered by HentaiList.io`, ctx.author.displayAvatarURL({ size: 32 }))

      return ctx.reply({ embed })
    }

    switch (args) {
      case 'random':
        // Get latest HAnime upload ID
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)
        var $ = await fetch('https://hanime.tv/', {
          signal: controller.signal
        }).then((r) => {
          if (!r.ok) throw new Error('Something went wrong.')
          return r.text()
        }).then((html) => cheerio.load(html))
        clearTimeout(timeout)

        var newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

        newestID = await hentailist(newestID)

        newestID = newestID[0].id

        await hentailist(Math.random() * (newestID - 5) + 5)
        break

      default:
        await hentailist(args)
        break
    }
  }
}

module.exports = HentaiList
