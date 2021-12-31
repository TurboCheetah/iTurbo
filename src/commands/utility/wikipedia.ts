import c from '@aero/centra'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class WikipediaCommand {
    @Slash('wikipedia', { description: 'Search for something on Wikipedia' })
    async wikipedia(
        @SlashOption('query', { description: "What you'd like to search for" })
        query: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const article = await c('https://en.wikipedia.org/api/rest_v1/page/summary/', 'GET').path(client.utils.toProperCase(query)).json()

        if (!article.content_urls) interaction.editReply("I couldn't find a wikipedia article with that title!")

        const embed = new MessageEmbed().setColor(0x9590ee).setThumbnail('https://i.imgur.com/fnhlGh5.png').setURL(article.content_urls.desktop.page).setTitle(article.title).setDescription(article.extract)
        interaction.editReply({ embeds: [embed] })
    }
}
