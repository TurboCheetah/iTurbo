const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const malScraper = require('mal-scraper')

class MyAnimeList extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('myAnimeListDescription'),
      usage: language => language.get('myAnimeListUsage'),
      arguments: {
        anime: "The anime you'd like to search",
        page: "The page of the results you'd like to view"
      },
      examples: {
        'Plastic Memories': 'Returns data on Plastic Memories',
        'Full Metal Alchemist | 2': 'Returns the second page of data'
      },
      aliases: ['mal'],
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async getData(ctx, anime, page) {
    const data = await malScraper.getInfoFromName(anime)

    if (!data) return ctx.reply(ctx.language.get('noResults'))

    const synopsisEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(data.englishTitle ? `${data.englishTitle}${data.title.toLowerCase() !== data.englishTitle.toLowerCase() ? ` (${ctx.language.get('myAnimeListJapanese', data.title)})` : ''}` : data.title)
      .setDescription(data.synopsis)
      .setThumbnail(data.picture)
      .setURL(data.url)
      .setFooter(`${ctx.language.get('myAnimeListID')} ${data.id}`)

    const dataEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(data.englishTitle ? `${data.englishTitle}${data.title.toLowerCase() !== data.englishTitle.toLowerCase() ? ` (${ctx.language.get('myAnimeListJapanese', data.title)})` : ''}` : data.title)
      .addField(ctx.language.get('myAnimeListAgeRating'), data.rating.split(' - ')[0], true)
      .addField(ctx.language.get('myAnimeListEpisodes'), `${data.episodes} (${data.duration})`, true)
      .addField(ctx.language.get('myAnimeListStatus'), `${data.status}`, true)
      .addField(ctx.language.get('myAnimeListScore'), `${data.score}/10`, true)
      .addField(ctx.language.get('myAnimeListRanking'), data.ranked, true)
      .addField(ctx.language.get('myAnimeListPopularity'), data.popularity, true)
      .addField(ctx.language.get('myAnimeListMembers'), data.members, true)
      .addField(ctx.language.get('myAnimeListFavorites'), data.favorites, true)
      .addField(data.studios.length > 1 ? ctx.language.get('myAnimeListStudios') : ctx.language.get('myAnimeListStudio'), data.studios.join(', '), true)
      .addField(data.genres.length > 1 ? ctx.language.get('myAnimeListGenres') : ctx.language.get('myAnimeListGenre'), data.genres.join(', '))
      .setThumbnail(data.picture)
      .setURL(data.url)
      .setFooter(ctx.language.get('myAnimeListID', data.id))

    const embeds = [synopsisEmbed, dataEmbed]

    for (const character of data.characters) {
      const characterEmbed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(data.englishTitle ? `${data.englishTitle}${data.title.toLowerCase() !== data.englishTitle.toLowerCase() ? ` (${ctx.language.get('myAnimeListJapanese')} ${data.title})` : ''}` : data.title)
        .setImage(character.picture)
        .setURL(character.link)
        .addField(ctx.language.get('myAnimeListName'), character.name, true)
        .addField(ctx.language.get('myAnimeListRole'), character.role, true)
        .addField(ctx.language.get('myAnimeListSeiyuu'), `[${character.seiyuu.name}](${character.seiyuu.link})`, true)
        .setFooter(ctx.language.get('myAnimeListID', data.id))

      embeds.push(characterEmbed)
    }

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `${ctx.language.get('myAnimeListID', data.id)} • ${ctx.language.get('page', page, pages)}`)

    return Pagination.build()
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription(ctx.language.get('myAnimeListPrompt'))
        .setTimestamp()
        .setColor(this.client.constants.color)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply(ctx.language.get('noReplyTimeout', 60))

      if (response.toLowerCase()) {
        const page = this.verifyInt(1, 1)
        return await this.getData(ctx, response, page)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply(ctx.language.get('operationCancelled'))
      }
    }
    let [title, page = 1] = args.join(' ').split(' | ')
    page = this.verifyInt(page, 1)

    return this.getData(ctx, title, page)
  }
}

module.exports = MyAnimeList
