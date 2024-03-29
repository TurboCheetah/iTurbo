import { Pagination } from '@discordx/pagination'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Guard, Slash, SlashGroup, SlashOption } from 'discordx'
import { Doujin } from 'nhentai'
import { IslaClient } from '#/Client'
import { IsNsfw } from '#guards/IsNsfw'

@Discord()
@SlashGroup({ name: 'nhentai', description: 'Read doujin from nHentai' })
export abstract class NHentaiCommands {
    @Slash('doujin', { description: 'Read doujin from nHentai' })
    @Guard(IsNsfw)
    async doujin(
        @SlashOption('id', { description: "The name of the ID of the doujin you'd like to read" })
        id: number,
        @SlashOption('page', { description: "The page you'd like to view", required: false })
        page: number,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const doujin = await client.nhentai.fetchDoujin(id)

        if (doujin === null) return interaction.editReply({ embeds: [new MessageEmbed().setColor(0xee9090).setTitle('Doujin not found').setDescription('Please try another ID.')] })

        const embeds = this.embedBuilder(doujin, client)

        const pagination = new Pagination(interaction, embeds, { type: 'BUTTON', initialPage: page })
        await pagination.send()
    }

    @Slash('random', { description: 'Read a random doujin from nHentai' })
    @Guard(IsNsfw)
    async random(
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const doujin = await client.nhentai.randomDoujin()

        const embeds = this.embedBuilder(doujin, client)

        const pagination = new Pagination(interaction, embeds, { type: 'BUTTON' })
        await pagination.send()
    }

    embedBuilder(doujin: Doujin, client: IslaClient): MessageEmbed[] {
        const coverEmbed = new MessageEmbed()
            .setColor(0x9590ee)
            .setTitle(doujin.titles.pretty.length > 0 ? doujin.titles.pretty : doujin.titles.english.length > 0 ? doujin.titles.english : doujin.titles.japanese)
            .setURL(doujin.url)
            .setImage(doujin.cover.url)
            .addField('Favorites', `${doujin.favorites}`, true)
            .addField('Length', `${doujin.length}`, true)
            .addField('Language', doujin.tags.languages.map(language => client.utils.toProperCase(language.name)).join(', ') || 'Japanese', true)
            .addField('Parody', doujin.tags.parodies.map(parody => parody.name).join(', ') || 'False', true)
            .addField('Characters', doujin.tags.characters.map(character => character.name).join(', ') || 'None specified', true)
            .addField(client.constants.zws, client.constants.zws, true)
            .addField('Groups', doujin.tags.groups.map(group => group.name).join(', ') || 'None specified', true)
            .addField('Artists', doujin.tags.artists.map(artist => artist.name).join(', ') || 'None specified', true)
            .addField('Tags', doujin.tags.tags.map(tag => tag.name).join(', ') || 'None specified', false)
            .setFooter({ text: `${doujin.id}` })

        const pages = doujin.pages.map((p, i) => {
            return new MessageEmbed()
                .setColor(0x9590ee)
                .setTitle(doujin.titles.pretty.length > 0 ? doujin.titles.pretty : doujin.titles.english.length > 0 ? doujin.titles.english : doujin.titles.japanese)
                .setURL(doujin.url)
                .setImage(p.url)
                .setFooter({ text: `${doujin.id} | Page ${i + 1} of ${doujin.pages.length}` })
        })

        return [coverEmbed, ...pages]
    }
}
