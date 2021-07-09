const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const ms = require('ms')

class Anilist extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/anime/anilist:description'),
      usage: language => language('commands/anime/anilist:usage'),
      arguments: {
        query: "The term you'd like to search",
        page: "The page of the results you'd like to view",
        type: "The type of search you'd like to perform"
      },
      examples: {
        'plastic memories': 'Searches for "Plastic Memories"',
        'plastic memories --manga': 'Searches for the "Plastic Memories" manga',
        'turbo --user': 'Searches for the user "Turbo"'
      },
      aliases: ['ani'],
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async getAnimeData(ctx, query, page) {
    let { media: [data] } = await this.client.anilist.searchEntry.anime(query, null, page, 1)
    data = await this.client.anilist.media.anime(data.id, null, page, 1)
    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(data.title.romaji)
      .setURL(data.siteUrl)
      .setThumbnail(data.coverImage.large)
      .setDescription(data.description ? `${data.title.english ? ctx.translate('commands/anime/anilist:english', { title: data.title.english }) : ''}${data.title.native ? ctx.translate('commands/anime/anilist:japanese', { title: data.title.native }) : ''}\n${data.description.replace(/<.+?>/ig, '')}` : ctx.translate('commands/anime/anilist:noDescription'))
      .addField(ctx.translate('commands/anime/anilist:type'), data.format === 'TV' ? ctx.translate('commands/anime/anilist:tv') : (data.format === 'MOVIE' ? ctx.translate('commands/anime/anilist:movie') : ctx.translate('commands/anime/anilist:ova')), true)
      .addField(ctx.translate('commands/anime/anilist:episodes'), data.episodes, true)
      .addField(ctx.translate('commands/anime/anilist:duration'), ms(data.duration * 60 * 1000, { long: true }), true)
      .addField(ctx.translate('commands/anime/anilist:score'), `${data.averageScore}%`, true)
      .addField(ctx.translate('commands/anime/anilist:favorites'), data.favourites, true)
      .addField(ctx.translate('commands/anime/anilist:popularity'), data.popularity, true)
      .addField(ctx.translate('commands/anime/anilist:genres'), data.genres.join(', '), true)
      .setFooter(ctx.translate('commands/anime/anilist:id', { id: data.id }), 'https://i.imgur.com/evdGjD6.png')

    return ctx.reply({ embed })
  }

  async getMangaData(ctx, query, page) {
    let { media: [data] } = await this.client.anilist.searchEntry.manga(query, null, page, 1)
    data = await this.client.anilist.media.manga(data.id, null, page, 1)
    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(data.title.romaji)
      .setURL(data.siteUrl)
      .setImage(data.coverImage.medium)
      .setDescription(data.description ? `${data.title.english ? ctx.translate('commands/anime/anilist:english', data.title.english) : ''}${data.title.native ? ctx.translate('commands/anime/anilist:japanese', data.title.native) : ''}\n${data.description.replace(/<.+?>/ig, '')}` : ctx.translate('commands/anime/anilist:noDescription'))
      .addField(ctx.translate('commands/anime/anilist:chapters'), data.chapters, true)
      .addField(ctx.translate('commands/anime/anilist:volumes'), data.volumes ? data.volumes : ctx.translate('common:none'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('commands/anime/anilist:score'), `${data.averageScore}%`, true)
      .addField(ctx.translate('commands/anime/anilist:favorites'), data.favourites, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('commands/anime/anilist:popularity'), data.popularity, true)
      .addField(ctx.translate('commands/anime/anilist:genres'), data.genres.join(', '), true)
      .setFooter(ctx.translate('commands/anime/anilist:id', { id: data.id }), 'https://i.imgur.com/evdGjD6.png')

    return ctx.reply({ embed })
  }

  async getUserData(ctx, query, page) {
    const data = await this.client.anilist.user.all(query)
    if (!data || data.status === 404) return ctx.tr('common:noResults')
    const profileEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(ctx.translate('commands/anime/anilist:profile'))
      .setTitle(data.name)
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      .setDescription(data.about ? data.about : ctx.translate('commands/anime/anilist:noAbout'))
      .addField(ctx.translate('commands/anime/anilist:animesWatched'), data.statistics.anime.count, true)
      .addField(ctx.translate('commands/anime/anilist:episodesWatched'), data.statistics.anime.episodesWatched, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('commands/anime/anilist:planning'), data.statistics.anime.statuses.filter(s => s.status === 'PLANNING')[0].count, true)
      .addField(ctx.translate('commands/anime/anilist:timeWatched'), ms(data.statistics.anime.minutesWatched * 60 * 1000, { long: true }), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('commands/anime/anilist:topGenres'), data.statistics.anime.genres.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', '))
      // .setImage(data.bannerImage ? data.bannerImage : '')
      .setFooter(`${ctx.translate('commands/anime/anilist:id', { id: data.id })} • ${ctx.translate('common:reactForMore')}`, 'https://i.imgur.com/evdGjD6.png')

    const mangaStatsEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(data.name, null, data.siteUrl)
      .setTitle(ctx.translate('commands/anime/anilist:mangaStats'))
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      .addField(ctx.translate('commands/anime/anilist:mangasRead'), data.statistics.manga.count, true)
      .addField(ctx.translate('commands/anime/anilist:volumesRead'), data.statistics.manga.volumesRead, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.translate('commands/anime/anilist:topGenres'), data.statistics.manga.genres.length ? data.statistics.manga.genres.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', ') : ctx.translate('common:none'))
      .setFooter(`${ctx.translate('commands/anime/anilist:id', { id: data.id })} • ${ctx.translate('common:reactForMore')}`, 'https://i.imgur.com/evdGjD6.png')

    const favoritesEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(data.name, null, data.siteUrl)
      .setTitle(ctx.translate('commands/anime/anilist:favorites'))
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.translate('commands/anime/anilist:anime'), data.favourites.anime.length ? data.favourites.anime.slice(0, 5).map(a => `[${a.title.romaji}](https://anilist.co/anime/${a.id})`) : ctx.translate('common:none'), true)
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.translate('commands/anime/anilist:manga'), data.favourites.manga.length ? data.favourites.manga.slice(0, 5).map(m => `[${m.title.romaji}](https://anilist.co/manga/${m.id})`).join('\n') : ctx.translate('common:none'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.translate('commands/anime/anilist:characters'), data.favourites.characters !== null && data.favourites.characters.length ? data.favourites.characters.slice(0, 5).map(c => `[${c.name}](https://anilist.co/character/${c.id})`).join('\n') : ctx.translate('common:none'), true)
      .addField(ctx.translate('commands/anime/anilist:staff'), data.favourites.staff !== null && data.favourites.staff.length ? data.favourites.staff.slice(0, 5).map(s => `[${s.name}](https://anilist.co/staff/${s.id})`) : ctx.translate('common:none'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.translate('commands/anime/anilist:studios'), data.favourites.studios.length ? data.favourites.studios.slice(0, 5).map(s => `[${s.name}](https://anilist.co/studio/${s.id})`) : ctx.translate('common:none'), true)
      .setFooter(`${ctx.translate('commands/anime/anilist:id', { id: data.id })} • ${ctx.translate('common:reactForMore')}`, 'https://i.imgur.com/evdGjD6.png')

    const embeds = [profileEmbed, mangaStatsEmbed, favoritesEmbed]

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `${ctx.translate('commands/anime/anilist:id', { id: data.id })} • ${ctx.translate('common:reactForMore')} • ${ctx.translate('page', { page: page, pages: pages })}`)

    return Pagination.build()
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription(ctx.translate('commands/anime/anilist:prompt'))
        .setTimestamp()
        .setColor(this.client.constants.color)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.tr('common:noReplyTimeout', { time: 60 })

      if (response.toLowerCase() && response.toLowerCase() !== 'cancel') {
        const page = this.verifyInt(1, 1)
        return await this.getUserData(ctx, response, page)
      } else {
        return ctx.tr('common:operationCancelled')
      }
    }
    let [query, page = 1] = args.join(' ').split(' | ')
    page = this.verifyInt(page, 1)

    switch (Object.keys(ctx.flags)[0]) {
      case 'anime':
        this.getAnimeData(ctx, query, page)
        break
      case 'character':
        this.getCharacterData(ctx, query, page)
        break
      case 'manga':
        this.getMangaData(ctx, query, page)
        break
      case 'user':
        this.getUserData(ctx, query, page)
        break
      default:
        this.getAnimeData(ctx, query, page)
        break
    }
  }
}

module.exports = Anilist
