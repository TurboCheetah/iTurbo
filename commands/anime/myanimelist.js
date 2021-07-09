const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const malScraper = require('mal-scraper')

class MyAnimeList extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/anime/myanimelist:description'),
      usage: language => language('commands/anime/myanimelist:usage'),
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

    if (!data) return ctx.tr('common:noResults')

    const synopsisEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(data.englishTitle ? `${data.englishTitle}${data.title.toLowerCase() !== data.englishTitle.toLowerCase() ? ` (${ctx.translate('commands/anime/myanimelist:japanese', { title: data.title })})` : ''}` : data.title)
      .setDescription(data.synopsis)
      .setThumbnail(data.picture)
      .setURL(data.url)
      .setFooter(ctx.translate('commands/anime/myanimelist:id', { id: data.id }))

    const dataEmbed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(data.englishTitle ? `${data.englishTitle}${data.title.toLowerCase() !== data.englishTitle.toLowerCase() ? ` (${ctx.translate('commands/anime/myanimelist:japanese', { title: data.title })})` : ''}` : data.title)
      .addField(ctx.translate('commands/anime/myanimelist:ageRating'), data.rating.split(' - ')[0], true)
      .addField(ctx.translate('commands/anime/myanimelist:episodes'), `${data.episodes} (${data.duration})`, true)
      .addField(ctx.translate('commands/anime/myanimelist:status'), `${data.status}`, true)
      .addField(ctx.translate('commands/anime/myanimelist:score'), `${data.score}/10`, true)
      .addField(ctx.translate('commands/anime/myanimelist:ranking'), data.ranked, true)
      .addField(ctx.translate('commands/anime/myanimelist:popularity'), data.popularity, true)
      .addField(ctx.translate('commands/anime/myanimelist:members'), data.members, true)
      .addField(ctx.translate('commands/anime/myanimelist:favorites'), data.favorites, true)
      .addField(data.studios.length > 1 ? ctx.translate('commands/anime/myanimelist:studios') : ctx.translate('commands/anime/myanimelist:studio'), data.studios.join(', '), true)
      .addField(data.genres.length > 1 ? ctx.translate('commands/anime/myanimelist:genres') : ctx.translate('commands/anime/myanimelist:genre'), data.genres.join(', '))
      .setThumbnail(data.picture)
      .setURL(data.url)
      .setFooter(ctx.translate('commands/anime/myanimelist:id', { id: data.id }))

    const embeds = [synopsisEmbed, dataEmbed]

    for (const character of data.characters) {
      const characterEmbed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(data.englishTitle ? `${data.englishTitle}${data.title.toLowerCase() !== data.englishTitle.toLowerCase() ? ` (${ctx.translate('commands/anime/myanimelist:japanese', { title: data.title })})` : ''}` : data.title)
        .setImage(character.picture)
        .setURL(character.link)
        .addField(ctx.translate('commands/anime/myanimelist:name'), character.name, true)
        .addField(ctx.translate('commands/anime/myanimelist:role'), character.role, true)
        .addField(ctx.translate('commands/anime/myanimelist:seiyuu'), `[${character.seiyuu.name}](${character.seiyuu.link})`, true)
        .setFooter(ctx.translate('commands/anime/myanimelist:id', { id: data.id }))

      embeds.push(characterEmbed)
    }

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `${ctx.translate('commands/anime/myanimelist:id', data.id)} • ${ctx.translate('page', { page: page, pages: pages })}`)

    return Pagination.build()
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription(ctx.translate('commands/anime/myanimelist:prompt'))
        .setTimestamp()
        .setColor(this.client.constants.color)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.tr('common:noReplyTimeout', { time: 60 })

      if (response.toLowerCase()) {
        const page = this.verifyInt(1, 1)
        return await this.getData(ctx, response, page)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.tr('common:operationCancelled')
      }
    }
    let [title, page = 1] = args.join(' ').split(' | ')
    page = this.verifyInt(page, 1)

    return this.getData(ctx, title, page)
  }
}

module.exports = MyAnimeList
