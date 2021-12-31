import c from '@aero/centra'
import { Pagination } from '@discordx/utilities'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class UrbanCommand {
    @Slash('urbandictionary', { description: 'Search for a word on UrbanDictionary' })
    async urbandictionary(
        @SlashOption('word', { description: "The word you'd like to search for" })
        word: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const { list } = await c('https://api.urbandictionary.com/v0/define', 'GET').query({ term: word }).json()

        if (!list.length) return interaction.editReply('No results found')

        const pages = list.map((d: { definition: string; permalink: string; thumbs_up: number; thumbs_down: number; author: string; example: string }) => {
            const definition = this.content(d.definition, d.permalink)

            return new MessageEmbed().setColor(0x9590ee).setTitle(client.utils.toProperCase(word)).setURL(d.permalink).setThumbnail('http://i.imgur.com/CcIZZsa.png').addField('Definition', definition).addField('Example', this.example(d.example)).addField('Author', d.author, true).addField('Likes', `👍 ${d.thumbs_up}`, true).addField('Dislikes', `👎 ${d.thumbs_down}`, true).setFooter({ text: 'Powered by UrbanDictionary' })
        })

        const pagination = new Pagination(interaction, pages, { type: 'BUTTON' })
        await pagination.send()
    }

    example(example: string): string {
        const format = this.format(example)
        if (format.length < 750) return format
        if (example.length < 750) return example
        return this.cutText(example, 750)
    }

    content(definition: string, permalink: string): string {
        const format = this.format(definition)
        if (format.length < 750) return format
        if (definition.length < 750) return definition
        return `${this.cutText(definition, 750)}... [continue reading](${permalink})`
    }

    cutText(str: string, length: number): string {
        if (str.length < length) return str
        const cut = this.splitText(str, length - 3)
        if (cut.length < length - 3) return `${cut}...`
        return `${cut.slice(0, length - 3)}...`
    }

    splitText(str: string, length: number, char = ' '): string {
        const x = str.substring(0, length).lastIndexOf(char)
        const pos = x === -1 ? length : x
        return str.substring(0, pos)
    }

    format(str: string): string {
        // https://stackoverflow.com/questions/52374809/javascript-regular-expression-to-catch-boxes
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return str.replace(/\[([^\][]+)\]/g, (x, y) => `${x}(https://www.urbandictionary.com/define.php?term=${y.replace(/\s+/g, '+')})`)
    }
}
