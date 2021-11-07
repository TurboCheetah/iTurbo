import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption, SlashGroup } from 'discordx'
import { Pagination } from '@discordx/utilities'
import { client } from '../../index'
import ms from 'ms'
import { zws } from '../../constants'

@Discord()
@SlashGroup('anilist', 'Retrieve data from anilist')
export abstract class AnilistCommands {
  @Slash('anime')
  async anime(
    @SlashOption('name', { description: "The name of the anime you'd like to search for", required: true })
    name: string,
    @SlashOption('page', { description: "The page you'd like to view", required: false })
    page: number,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const {
      media: [search]
    } = await client.anilist.searchEntry.anime(name, undefined, page, 1)
    const data = await client.anilist.media.anime(search.id)
    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(data.title.romaji)
      .setURL(data.siteUrl)
      .setThumbnail(data.coverImage.large)
      .setImage(`https://img.anili.st/media/${data.id}`)
      .setDescription(data.description !== null ? `${data.title.english !== null ? `**English Title:** ${data.title.english}\n` : ''}${data.title.native !== null ? `**Japanese Title:** ${data.title.native}\n` : ''}\n${data.description.replace(/<.+?>/gi, '')}` : 'This anime does not have a description.')
      .addField('Type', data.format === 'TV' ? '📺 TV' : data.format === 'MOVIE' ? '🎬 Movie' : '💿 OVA', true)
      .addField('Episode(s)', `${data.episodes}`, true)
      .addField('Duration', ms(data.duration * 60 * 1000, { long: true }), true)
      .addField('Score', `${data.averageScore}%`, true)
      .addField('Favorites', `${data.favourites}`, true)
      .addField('Popularity', `${data.popularity}`, true)
      .setFooter(`ID: ${data.id}`)

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('manga')
  async manga(
    @SlashOption('name', { description: "The name of the anime you'd like to search for", required: true })
    name: string,
    @SlashOption('result', { description: "The result you'd like to view", required: false })
    result: number,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const {
      media: [search]
    } = await client.anilist.searchEntry.manga(name, undefined, result, 1)
    const data = await client.anilist.media.manga(search.id)

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(data.title.romaji)
      .setURL(data.siteUrl)
      .setThumbnail(data.coverImage.large)
      .setImage(`https://img.anili.st/media/${data.id}`)
      .setDescription(data.description !== null ? `${data.title.english !== null ? `**English Title:** ${data.title.english}\n` : ''}${data.title.native !== null ? `**Japanese Title:** ${data.title.native}\n` : ''}\n${data.description.replace(/<.+?>/gi, '')}` : 'This manga does not have a description.')
      .addField('Chapter(s)', `${data.chapters}`, true)
      .addField('Volume(s)', data.volumes !== 0 ? `${data.volumes}` : 'None', true)
      .addField('Score', `${data.averageScore}%`, true)
      .addField('Favorites', `${data.favourites}`, true)
      .addField('Popularity', `${data.popularity}`, true)
      .addField('Genre(s)', data.genres.join(', '), true)

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('user')
  async user(
    @SlashOption('user', { description: "The name of the user you'd like to search for", required: true })
    user: string,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
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
      .addField(zws, zws, true)
      .addField('Planning to Watch', `${data.statistics.anime.statuses.filter(s => s.status === 'PLANNING')[0].count}`, true)
      .addField('Time Watched', ms(data.statistics.anime.minutesWatched * 60 * 1000, { long: true }), true)
      .addField(zws, zws, true)
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
      .addField(zws, zws, true)
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
      .addField(zws, zws, true)
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
      .addField(zws, zws, true)
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
