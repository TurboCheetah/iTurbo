const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const cheerio = require('cheerio')
const c = require('@aero/centra')

class Succubus extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Search for hentai on Succubus.Space',
      usage: 'succubus <hentai>',
      aliases: ['succ', 'ss', 'hl', 'hlist'],
      cooldown: 5,
      cost: 5,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply('What am I supposed to search for?')
    args = args.join('-').toString().split('-')[0]

    const hentailist = async id => {
      const data = await c(`https://api.succubus.space/hentai/${encodeURIComponent(id)}`).json()

      if (!data || data.invalid === true) return ctx.reply('No results found.')

      const tags = []
      for (let i = 0; i < data.tags.length; i++) {
        tags[i] = data.tags[i]
      }

      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle(data.name)
        .setURL(data.url)
        .setThumbnail(data.cover_url)
        .setImage(data.poster_url)
        .addField(
          'Description',
          data.description
            ? this.client.utils.shorten(
                data.description
                  .replace(/(<([^>]+)>)/gi, '')
                  .replace(/\/r/g, '')
                  .replace(/\/n/g, '')
              )
            : 'No description given.'
        )
        .addField('Release Date', data.released_at, true)
        .addField('Producer', data.brand, true)
        .addField('Censored', this.client.utils.toProperCase(data.is_censored.toString()), true)
        .addField('Views', data.views, true)
        .addField('Likes', data.likes, true)
        .addField('Interests', data.interests, true)
        .addField('Tags', `\`\`\`${tags.join(', ')}\`\`\``)
        .setFooter(`ID: ${data.id} | Powered by Succubus.Space`, ctx.author.displayAvatarURL({ size: 32, dynamic: true }))

      return ctx.reply({ embed })
    }

    switch (args[0]) {
      case 'random': {
        // Get latest HAnime upload ID
        const $ = await c('https://hanime.tv/')
          .text()
          .then(html => cheerio.load(html))

        let newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

        newestID = await hentailist(newestID)

        newestID = newestID.id

        await hentailist(Math.floor(Math.random() * (newestID - 5) + 5))
        break
      }
      default:
        await hentailist(args)
        break
    }
  }
}

module.exports = Succubus
