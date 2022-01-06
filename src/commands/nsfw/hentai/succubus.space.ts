import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { gql, request } from 'graphql-request'
import { IslaClient } from '#/Client'
import { Doujin } from '#types/doujin.type'
import { Hentai } from '#types/hentai.type'

@Discord()
@SlashGroup('succubusspace', 'Retrieve data from Succubus.Space')
export abstract class SuccubusSpaceCommands {
    @Slash('hentai', { description: 'Search for a hentai on Succubus.Space' })
    async hentai(
        @SlashOption('query', { description: "The ID or name of the hentai you'd like to search for" })
        search: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
        const query = gql`
            query hentai($id: Float, $name: String) {
                hentai(id: $id, name: $name) {
                    id
                    name
                    description
                    coverURL
                    posterURL
                    releasedAt
                    brand {
                        title
                    }
                    isCensored
                    views
                    likes
                    interests
                    tags {
                        text
                    }
                    url
                }
            }
        `

        await interaction.deferReply({ ephemeral: !ephemeral })

        const { hentai }: { hentai: Hentai } = await request('https://api.succubus.space/graphql', query, isNaN(+search) ? { name: search } : { id: +search })

        if (!hentai) return interaction.editReply('This hentai could not be found.')

        const embed = new MessageEmbed()
            .setColor(0x9590ee)
            .setTitle(hentai.name)
            .setURL(hentai.url)
            .setThumbnail(hentai.coverURL)
            .setImage(hentai.posterURL)
            .addField('Description', hentai.malDescription ? client.utils.shorten(hentai.malDescription) : hentai.description ? client.utils.shorten(hentai.description) : 'No description given.')
            .addField('Release Date', new Date(hentai.releasedAt).toLocaleDateString(), true)
            .addField('Producer', hentai.brand.title, true)
            .addField('Censored', client.utils.toProperCase(hentai.isCensored.toString()), true)
            .addField('Views', hentai.views.toLocaleString(), true)
            .addField('Likes', hentai.likes.toLocaleString(), true)
            .addField('Interests', hentai.interests.toLocaleString(), true)
            .addField('Tags', `${hentai.tags.map(tag => tag.text).join(', ')}`)
            .setFooter({ text: `ID: ${hentai.id} | Powered by Succubus.Space` })

        interaction.editReply({ embeds: [embed] })
    }

    @Slash('doujin', { description: 'Search for a doujin on Succubus.Space' })
    async doujin(
        @SlashOption('query', { description: "The ID or name of the doujin you'd like to search for" })
        search: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<any> {
        const query = gql`
            query doujin($id: Int, $name: String) {
                doujin(id: $id, name: $name) {
                    id
                    titles {
                        english
                        japanese
                        pretty
                    }
                    uploadDate
                    length
                    favorites
                    url
                    cover
                    thumbnail
                    tags
                    invalid
                }
            }
        `

        await interaction.deferReply({ ephemeral: !ephemeral })

        const { doujin }: { doujin: Doujin } = await request('https://api.succubus.space/graphql', query, isNaN(+search) ? { name: search } : { id: +search })

        if (doujin.invalid) return interaction.editReply('This doujin could not be found.')

        const tags = []
        for (let i = 0; i < doujin.tags.length; i++) {
            tags[i] = doujin.tags[i]
        }

        const embed = new MessageEmbed()
            .setColor(0x9590ee)
            .setTitle(doujin.titles.pretty.length > 0 ? doujin.titles.pretty : doujin.titles.english.length > 0 ? doujin.titles.english : doujin.titles.japanese)
            .setURL(doujin.url)
            .setImage(doujin.cover)
        if (doujin.titles.english.length > 0) embed.addField('English Title', doujin.titles.english, true)
        if (doujin.titles.japanese.length > 0) embed.addField('Japanese Title', doujin.titles.japanese, true)
        embed
            .addField('Upload Date', new Date(doujin.uploadDate).toLocaleDateString(), true)
            .addField('Length', doujin.length.toLocaleString(), true)
            .addField('Favorites', doujin.favorites.toLocaleString(), true)
            .addField('Tags', `${tags.join(', ')}`)
            .setFooter({ text: `ID: ${doujin.id} | Powered by Succubus.Space` })

        interaction.editReply({ embeds: [embed] })
    }
}
