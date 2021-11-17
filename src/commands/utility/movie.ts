import c from '@aero/centra'
import { Pagination } from '@discordx/utilities'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export abstract class MovieCommand {
  @Slash('movie', { description: 'Search for a movie on TMDB.org' })
  async movie(
    @SlashOption('movie', { description: "The movie you'd like to search for", required: true })
    d: string,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<any> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const { results } = await c(`https://api.themoviedb.org/3/search/movie`, 'GET').query({ query: d, api_key: process.env.TMDB }).json()

    if (!results.length) return await interaction.editReply('No results found')

    const pages = results.map((d: { poster_path: string; title: string; overview: string; original_title: string; vote_count: number; vote_average: number; popularity: number; adult: boolean; release_date: string }) => {
      const embed = new MessageEmbed().setColor(0x9590ee).setImage(`https://image.tmdb.org/t/p/original${d.poster_path}`).setTitle(`${d.title}`).setDescription(d.overview).setFooter('Powered by TheMovieDB', 'https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png')
      if (d.title !== d.original_title) embed.addField('Original Title', d.original_title, true)
      embed
        .addField('Vote Count', `${d.vote_count}` || '0', true)
        .addField('Vote Average', `${d.vote_average}` || '0', true)
        .addField('Popularity', `${d.popularity}` || '0', true)
        .addField('Adult Content', d.adult ? 'Yes' : 'No', true)
        .addField('Release Date', d.release_date || 'Unknown', true)
      return embed
    })

    const pagination = new Pagination(interaction, pages)
    await pagination.send()
  }
}
