import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption, SlashGroup } from 'discordx'
import { Pagination } from '@discordx/utilities'
import ms from 'ms'
import { AnimeEntry, MangaEntry } from 'anilist-node'
import { IslaClient } from '../../Client'

@Discord()
@SlashGroup('anilist', 'Retrieve data from anilist')
export abstract class AnilistCommands {
  @Slash('anime', { description: 'Search for an anime on Anilist' })
  async anime(
    @SlashOption('name', { description: "The name of the anime you'd like to search for", required: true })
    name: string,
    @SlashOption('page', { description: "The page you'd like to view", required: false })
    page: number,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: Bot
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })
    const { media } = await client.anilist.searchEntry.anime(name, undefined, page, 5)
    const data: AnimeEntry[] = []
    for (const entry of media) {
      data.push(await client.anilist.media.anime(entry.id))
    }

    const pages = data.map(d => {
      return new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle(d.title.romaji)
        .setURL(d.siteUrl)
        .setThumbnail(d.coverImage.large)
        .setImage(`https://img.anili.st/media/${d.id}`)
        .setDescription(d.description !== null ? `${d.title.english !== null ? `**English Title:** ${d.title.english}\n` : ''}${d.title.native !== null ? `**Japanese Title:** ${d.title.native}\n` : ''}\n${d.description.replace(/<.+?>/gi, '')}` : 'This anime does not have a description.')
        .addField('Type', d.format === 'TV' ? '📺 TV' : d.format === 'MOVIE' ? '🎬 Movie' : d.format === 'ONA' ? '🌐 ONA' : '💿 OVA', true)
        .addField('Episode(s)', `${d.episodes}`, true)
        .addField('Duration', ms(d.duration * 60 * 1000, { long: true }), true)
        .addField('Score', `${d.averageScore}%`, true)
        .addField('Favorites', `${d.favourites}`, true)
        .addField('Popularity', `${d.popularity}`, true)
        .setFooter(`ID: ${d.id}`)
    })

    const pagination = new Pagination(interaction, pages)
    await pagination.send()
  }

  @Slash('manga', { description: 'Search for a manga on Anilist' })
  async manga(
    @SlashOption('name', { description: "The name of the anime you'd like to search for", required: true })
    name: string,
    @SlashOption('page', { description: "The page you'd like to view", required: false })
    page: number,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: Bot
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const { media } = await client.anilist.searchEntry.manga(name, undefined, page, 5)
    const data: MangaEntry[] = []
    for (const entry of media) {
      data.push(await client.anilist.media.manga(entry.id))
    }

    const pages = data.map(d => {
      return new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle(d.title.romaji)
        .setURL(d.siteUrl)
        .setThumbnail(d.coverImage.large)
        .setImage(`https://img.anili.st/media/${d.id}`)
        .setDescription(d.description !== null ? `${d.title.english !== null ? `**English Title:** ${d.title.english}\n` : ''}${d.title.native !== null ? `**Japanese Title:** ${d.title.native}\n` : ''}\n${d.description.replace(/<.+?>/gi, '')}` : 'This manga does not have a description.')
        .addField('Chapter(s)', `${d.chapters}`, true)
        .addField('Volume(s)', d.volumes !== 0 ? `${d.volumes}` : 'None', true)
        .addField('Score', `${d.averageScore}%`, true)
        .addField('Favorites', `${d.favourites}`, true)
        .addField('Popularity', `${d.popularity}`, true)
        .addField('Genre(s)', d.genres.join(', '), true)
        .setFooter(`ID: ${d.id}`)
    })

    const pagination = new Pagination(interaction, pages)
    await pagination.send()
  }

  @Slash('user', { description: 'Search for a user on Anilist' })
  async user(
    @SlashOption('user', { description: "The name of the user you'd like to search for", required: true })
    user: string,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: Bot
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const data = await client.anilist.user.all(user)
    const profileEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor('Profile')
      .setTitle(data.name)
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large !== null ? data.avatar.large : '')
      .addField('Animes Watched', `${data.statistics.anime.count}`, true)
      .addField('Episodes Watched', `${data.statistics.anime.episodesWatched}`, true)
      .addField(client.constants.zws, client.constants.zws, true)
      .addField('Planning to Watch', `${data.statistics.anime.statuses.filter(s => s.status === 'PLANNING')[0].count}`, true)
      .addField('Time Watched', ms(data.statistics.anime.minutesWatched * 60 * 1000, { long: true }), true)
      .addField(client.constants.zws, client.constants.zws, true)
      .addField(
        'Top Genres',
        data.statistics.anime.genres
          .slice(0, 5)
          .map(g => `${g.genre} (${g.count})`)
          .join(', ')
      )
      // .setImage(data.bannerImage ? data.bannerImage : '')
      .setFooter(`ID: ${data.id} • React to view more details`, 'https://i.imgur.com/evdGjD6.png')

    const mangaStatsEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(data.name, undefined, data.siteUrl)
      .setTitle('Manga Stats')
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large !== null ? data.avatar.large : '')
      .addField('Mangas Read', `${data.statistics.manga.count}`, true)
      .addField('Volumes Read', `${data.statistics.manga.volumesRead}`, true)
      .addField(client.constants.zws, client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      .addField('Top Genres', (data.statistics.manga.genres.length > 0) ? data.statistics.manga.genres.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', ') : 'None')
      .setFooter(`ID: ${data.id} • React to view more details`)

    const favoritesEmbed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(data.name, undefined, data.siteUrl)
      .setTitle('Favorites')
      .setURL(data.siteUrl)
      .setThumbnail(data.avatar.large !== null ? data.avatar.large : '')
      // eslint-disable-next-line prettier/prettier
      .addField('Anime', (data.favourites.anime.length > 0) ? data.favourites.anime.slice(0, 5).map(a => `[${a.title.romaji}](https://anilist.co/anime/${a.id})`).join(', ') : 'None', true)
      // eslint-disable-next-line prettier/prettier
      .addField('Manga', (data.favourites.manga.length > 0) ? data.favourites.manga.slice(0, 5).map(m => `[${m.title.romaji}](https://anilist.co/manga/${m.id})`).join(', ') : 'None', true)
      .addField(client.constants.zws, client.constants.zws, true)
      // eslint-disable-next-line prettier/prettier
      // .addField('Characters', data.favourites.character !== null ? data.favourites.character.slice(0, 5).map(c => `[${c.name}](https://anilist.co/character/${c.id})`).join(', ') : 'None', true)
      .addField(
        'Staff',
        data.favourites.staff !== null && data.favourites.staff.length > 0
          ? data.favourites.staff
              .slice(0, 5)
              .map(s => `[${s.name}](https://anilist.co/staff/${s.id})`)
              .join('\n')
          : 'None',
        true
      )
      .addField(client.constants.zws, client.constants.zws, true)
      .addField(
        'Studios',
        data.favourites.studios.length > 0
          ? data.favourites.studios
              .slice(0, 5)
              .map(s => `[${s.name}](https://anilist.co/studio/${s.id})`)
              .join('\n')
          : 'None',
        true
      )
      .setFooter(`ID: ${data.id} • React to view more details`)

    const pagination = new Pagination(interaction, [profileEmbed, mangaStatsEmbed, favoritesEmbed])
    await pagination.send()
  }
}
