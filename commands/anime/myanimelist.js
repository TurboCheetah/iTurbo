const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const malScraper = require('mal-scraper')

class MyAnimeList extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Search an Anime on MyAnimeList.net',
      usage: 'myanimelist <anime> | [page]',
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

    if (!data) return ctx.reply('No results found.')

    const [pictures] = await malScraper.getPictures({ name: data.englishTitle ? data.englishTitle : data.title, id: data.id })

    const synopsisEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(data.englishTitle ? `${data.englishTitle} (Japanese: ${data.title})` : data.title)
      .setDescription(data.synopsis)
      .setThumbnail(data.picture)
      .setImage(pictures.imageLink)
      .setURL(data.url)
      .setFooter(`ID: ${data.id} • React to view more details`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))

    const dataEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(data.englishTitle ? `${data.englishTitle} (Japanese: ${data.title})` : data.title)
      .addField('Age Rating', data.rating, true)
      .addField('Episodes', `${data.episodes} (${data.duration})`, true)
      .addField('Status', `${data.status} (From: ${data.aired})`, true)
      .addField('Score', `${data.score} (${data.scoreStats})`, true)
      .addField('Ranking', data.ranked, true)
      .addField('Popularity', data.popularity, true)
      .addField('Members', data.members, true)
      .addField('Favorites', data.favorites, true)
      .addField(data.genres.length > 1 ? 'Genres' : 'Genre', data.genres.join(', '))
      .addField('Source', data.source, true)
      .addField(data.studios.length > 1 ? 'Studios' : 'Studio', data.studios.join(', '), true)
      .setThumbnail(data.picture)
      .setURL(data.url)
      .setFooter(`ID: ${data.id} • React to view more details`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))

    const embeds = [synopsisEmbed, dataEmbed]

    for (const character of data.characters) {
      const characterEmbed = new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle(data.englishTitle ? `${data.englishTitle} (Japanese: ${data.title})` : data.title)
        .setImage(character.picture)
        .setURL(character.link)
        .addField('Name', character.name, true)
        .addField('Role', character.role, true)
        .addField('Seiyuu', `[${character.seiyuu.name}](${character.seiyuu.link})`, true)
        .setFooter(`ID: ${data.id} • React to view more details`)
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))

      embeds.push(characterEmbed)
    }

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `ID: ${data.id} • React to view more details • Page ${page} of ${pages}`)

    return Pagination.build()
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription('What would you like to search for?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.')
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (response.toLowerCase()) {
        const page = this.verifyInt(1, 1)
        return await this.getData(ctx, response, page)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply('Operation cancelled.')
      }
    }
    let [title, page = 1] = args.join(' ').split(' | ')
    page = this.verifyInt(page, 1)

    return this.getData(ctx, title, page)
  }
}

module.exports = MyAnimeList
