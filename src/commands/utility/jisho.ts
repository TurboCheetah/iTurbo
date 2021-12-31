import c from '@aero/centra'
import { Pagination } from '@discordx/utilities'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class JishoCommand {
    @Slash('jisho', { description: 'Search for a word on Jisho.org' })
    async jisho(
        @SlashOption('word', { description: "The word whose definition you'd like to view" })
        word: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const { data } = await c(`https://jisho.org/api/v1/search/words`, 'GET').query({ keyword: word }).json()

        if (!data.length) return interaction.editReply('No results found')

        const pages = data.map((d: { japanese: Array<{ reading: string; word: string }>; senses: Array<{ english_definitions: any[] }>; is_common: boolean }) => {
            return new MessageEmbed()
                .setColor(0x9590ee)
                .setURL(`https://jisho.org/search/${word}`)
                .setTitle(`${client.utils.toProperCase(word)}`)
                .addField('Japanese', d.japanese[0].word || d.japanese[0].reading, false)
                .addField('Reading', d.japanese[0].reading || d.japanese[0].word, false)
                .addField('English Meaning', `${client.utils.toProperCase(d.senses[0].english_definitions.join(', '))}`, false)
                .addField('Common', d.is_common ? 'Yes' : 'No', false)
                .setFooter({ text: 'Powered by Jisho.org' })
        })

        const pagination = new Pagination(interaction, pages)
        await pagination.send()
    }
}
