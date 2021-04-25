const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')
const ms = require('ms')

class Anilist extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Retrieve user data from Anilist.co',
      usage: 'anilist <user> | [page]',
      arguments: {
        user: "The user you'd like to search",
        page: "The page of the results you'd like to view"
      },
      aliases: ['ani'],
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async getData(ctx, user, page) {
    const data = await this.client.anilist.user.all(user)
    if (!data || data.status === 404) return ctx.reply(`No results found.${!parseInt(user) ? ' *Hint: Make sure you use the correct capitalization.*' : ''}`)

    const profileEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(data.name)
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      .setDescription(data.about ? data.about : 'User does not have an about section.')
      .setImage(data.bannerImage ? data.bannerImage : '')
      .setFooter(`ID: ${data.id} • React to view more details`)

    const animeStatsEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(data.name, null, data.siteUrl)
      .setTitle('Anime Stats')
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      .addField('Animes Watched', data.statistics.anime.count, true)
      .addField('Episodes Watched', data.statistics.anime.episodesWatched, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Time Watched', ms(data.statistics.anime.minutesWatched * 60 * 1000, { long: true }), true)
      // eslint-disable-next-line prettier/prettier
      .addField('Planning to Watch', data.statistics.anime.statuses.filter(s => s.status === 'PLANNING')[0].count, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField('Top Genres', data.statistics.anime.genres.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', '))
      .setFooter(`ID: ${data.id} • React to view more details`)

    const mangaStatsEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(data.name, null, data.siteUrl)
      .setTitle('Manga Stats')
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      .addField('Mangas Read', data.statistics.manga.count, true)
      .addField('Volumes Read', data.statistics.manga.volumesRead, true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField('Top Genres', data.statistics.manga.genres.length ? data.statistics.manga.genres.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', ') : 'None')
      .setFooter(`ID: ${data.id} • React to view more details`)

    const favoritesEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(data.name, null, data.siteUrl)
      .setTitle('Favorites')
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large ? data.avatar.large : '')
      // eslint-disable-next-line prettier/prettier
      .addField('Anime', data.favourites.anime.length ? data.favourites.anime.slice(0, 5).map(a => `[${a.title.romaji}](https://anilist.co/anime/${a.id})`) : 'None', true)
      // eslint-disable-next-line prettier/prettier
      .addField('Manga', data.favourites.manga.length ? data.favourites.manga.slice(0, 5).map(m => `[${m.title.romaji}](https://anilist.co/manga/${m.id})`).join('\n') : 'None', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField('Characters', data.favourites.characters !== null && data.favourites.characters.length ? data.favourites.characters.slice(0, 5).map(c => `[${c.name}](https://anilist.co/character/${c.id})`).join('\n') : 'None', true)
      .addField('Staff', data.favourites.staff !== null && data.favourites.staff.length ? data.favourites.staff.slice(0, 5).map(s => `[${s.name}](https://anilist.co/staff/${s.id})`) : 'None', true)
      .addField(this.client.constants.zws, this.client.constants.zws, true)
      .addField('Studios', data.favourites.studios.length ? data.favourites.studios.slice(0, 5).map(s => `[${s.name}](https://anilist.co/studio/${s.id})`) : 'None', true)
      .setFooter(`ID: ${data.id} • React to view more details`)

    const embeds = [profileEmbed, animeStatsEmbed, mangaStatsEmbed, favoritesEmbed]

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
    let [user, page = 1] = args.join(' ').split(' | ')
    page = this.verifyInt(page, 1)

    return this.getData(ctx, user, page)
  }
}

module.exports = Anilist
