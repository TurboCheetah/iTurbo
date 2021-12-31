import c from '@aero/centra'
import { Pagination } from '@discordx/utilities'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export abstract class TVCommand {
    @Slash('tv', { description: 'Search for a show on TMDB.org' })
    async tv(
        @SlashOption('show', { description: "The show you'd like to search for" })
        show: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const { results } = await c(`https://api.themoviedb.org/3/search/tv`, 'GET').query({ query: show, api_key: process.env.TMDB }).json()

        if (!results.length) return interaction.editReply('No results found')
        console.log(results)

        const pages = results.map((s: { poster_path: string; name: string; overview: string; original_name: string; vote_count: number; vote_average: number; popularity: number; first_air_date: string }) => {
            const embed = new MessageEmbed().setColor(0x9590ee).setImage(`https://image.tmdb.org/t/p/original${s.poster_path}`).setTitle(`${s.name}`).setDescription(s.overview).setFooter('Powered by TheMovieDB', 'https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png')
            if (s.name !== s.original_name) embed.addField('Original Title', s.original_name, true)
            embed
                .addField('Vote Count', `${s.vote_count}` || '0', true)
                .addField('Vote Average', `${s.vote_average}` || '0', true)
                .addField('Popularity', `${s.popularity}` || '0', true)
                .addField('Release Date', s.first_air_date || 'Unknown', true)
            return embed
        })

        const pagination = new Pagination(interaction, pages, { type: 'BUTTON' })
        await pagination.send()
    }
}
