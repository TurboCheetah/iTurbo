const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const ms = require('ms')

class Anilist extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('anilistDescription'),
      usage: language => language.get('anilistUsage'),
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
      .setDescription(data.description ? `${data.title.english ? ctx.language.get('anilistEnglish', data.title.english) : ''}${data.title.native ? ctx.language.get('anilistJapanese', data.title.native) : ''}\n${data.description.replace(/<.+?>/ig, '')}` : ctx.language.get('anilistNoDescription'))
      .addField(ctx.language.get('anilistType'), data.format === 'TV' ? ctx.language.get('anilistTV') : (data.format === 'MOVIE' ? ctx.language.get('anilistMovie') : ctx.language.get('anilistOVA')), true)
      .addField(ctx.language.get('anilistEpisodes'), data.episodes, true)
      .addField(ctx.language.get('anilistDuration'), ms(data.duration * 60 * 1000, { long: true }), true)
      .addField(ctx.language.get('anilistScore'), `${data.averageScore}%`, true)
      .addField(ctx.language.get('anilistFavorites'), data.favourites, true)
      .addField(ctx.language.get('anilistPopularity'), data.popularity, true)
      .addField(ctx.language.get('anilistGenres'), data.genres.join(', '), true)
      .setFooter(ctx.language.get('anilistID', data.id), 'https://i.imgur.com/evdGjD6.png')

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
      .setDescription(data.description ? `${data.title.english ? ctx.language.get('anilistEnglish', data.title.english) : ''}${data.title.native ? ctx.language.get('anilistJapanese', data.title.native) : ''}\n${data.description.replace(/<.+?>/ig, '')}` : ctx.language.get('anilistNoDescription'))
      .addField(ctx.language.get('anilistChapters'), data.chapters, true)
      .addField(ctx.language.get('anilistVolumes'), data.volumes ? data.volumes : ctx.language.get('none'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('anilistScore'), `${data.averageScore}%`, true)
      .addField(ctx.language.get('anilistFavorites'), data.favourites, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('anilistPopularity'), data.popularity, true)
      .addField(ctx.language.get('anilistGenres'), data.genres.join(', '), true)
      .setFooter(ctx.language.get('anilistID', data.id), 'https://i.imgur.com/evdGjD6.png')

    return ctx.reply({ embed })
  }

  async getUserData(ctx, query, page) {
    const data = await this.client.anilist.user.all(query)
    if (!data || data.status === 404) return ctx.reply(`No results found.${!parseInt(query) ? ' *Hint: Make sure you use the correct capitalization.*' : ''}`)
    const profileEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(ctx.language.get('anilistProfile'))
      .setTitle(data.name)
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      .setDescription(data.about ? data.about : ctx.language.get('anilistNoAbout'))
      .addField(ctx.language.get('anilistAnimesWatched'), data.statistics.anime.count, true)
      .addField(ctx.language.get('anilistEpisodesWatched'), data.statistics.anime.episodesWatched, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('anilistPlanning'), data.statistics.anime.statuses.filter(s => s.status === 'PLANNING')[0].count, true)
      .addField(ctx.language.get('anilistTimeWatched'), ms(data.statistics.anime.minutesWatched * 60 * 1000, { long: true }), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('anilistTopGenres'), data.statistics.anime.genres.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', '))
      // .setImage(data.bannerImage ? data.bannerImage : '')
      .setFooter(`${ctx.language.get('anilistID', data.id)} • ${ctx.language.get('reactForMore')}`, 'https://i.imgur.com/evdGjD6.png')

    const mangaStatsEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(data.name, null, data.siteUrl)
      .setTitle(ctx.language.get('anilistMangaStats'))
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      .addField(ctx.language.get('anilistMangasRead'), data.statistics.manga.count, true)
      .addField(ctx.language.get('anilistVolumesRead'), data.statistics.manga.volumesRead, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.language.get('anilistTopGenres'), data.statistics.manga.genres.length ? data.statistics.manga.genres.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', ') : ctx.language.get('none'))
      .setFooter(`${ctx.language.get('anilistID', data.id)} • ${ctx.language.get('reactForMore')}`, 'https://i.imgur.com/evdGjD6.png')

    const favoritesEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(data.name, null, data.siteUrl)
      .setTitle(ctx.language.get('anilistFavorites'))
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.language.get('anilistAnime'), data.favourites.anime.length ? data.favourites.anime.slice(0, 5).map(a => `[${a.title.romaji}](https://anilist.co/anime/${a.id})`) : ctx.language.get('none'), true)
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.language.get('anilistManga'), data.favourites.manga.length ? data.favourites.manga.slice(0, 5).map(m => `[${m.title.romaji}](https://anilist.co/manga/${m.id})`).join('\n') : ctx.language.get('none'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField(ctx.language.get('anilistCharacters'), data.favourites.characters !== null && data.favourites.characters.length ? data.favourites.characters.slice(0, 5).map(c => `[${c.name}](https://anilist.co/character/${c.id})`).join('\n') : ctx.language.get('none'), true)
      .addField(ctx.language.get('anilistStaff'), data.favourites.staff !== null && data.favourites.staff.length ? data.favourites.staff.slice(0, 5).map(s => `[${s.name}](https://anilist.co/staff/${s.id})`) : ctx.language.get('none'), true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField(ctx.language.get('anilistStudios'), data.favourites.studios.length ? data.favourites.studios.slice(0, 5).map(s => `[${s.name}](https://anilist.co/studio/${s.id})`) : ctx.language.get('none'), true)
      .setFooter(`${ctx.language.get('anilistID', data.id)} • ${ctx.language.get('reactForMore')}`, 'https://i.imgur.com/evdGjD6.png')

    const embeds = [profileEmbed, mangaStatsEmbed, favoritesEmbed]

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `${ctx.language.get('anilistID', data.id)} • ${ctx.language.get('reactForMore')} • ${ctx.language.get('page', page, pages)}`)

    return Pagination.build()
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription(ctx.language.get('anilistPrompt'))
        .setTimestamp()
        .setColor(this.client.constants.color)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply(ctx.language.get('noReplyTimeout', 60))

      if (response.toLowerCase() && response.toLowerCase() !== 'cancel') {
        const page = this.verifyInt(1, 1)
        return await this.getUserData(ctx, response, page)
      } else {
        return ctx.reply(ctx.language.get('operationCancelled'))
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
