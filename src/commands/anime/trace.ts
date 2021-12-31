import { IslaClient } from '#/Client'
import { Collection, CommandInteraction, ContextMenuInteraction, MessageAttachment, MessageEmbed } from 'discord.js'
import { ContextMenu, Discord, Slash, SlashOption } from 'discordx'
import { Pagination } from '@discordx/utilities'
import { Anilist, Result } from 'trace.moe.ts/dist/structures/Result'

@Discord()
export abstract class TraceCommand {
    @Slash('trace', { description: 'Identify an anime using Trace.moe' })
    async trace(
        @SlashOption('url', { description: "The URL of the anime screenshot you'd like to identify" })
        url: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const data = await client.trace.fetchAnime(url, { anilistInfo: true })

        const pages = data.result.map((d: Result) => {
            const embed = new MessageEmbed()
                .setColor(0x9590ee)
                .setTitle((d.anilist as Anilist).title.romaji)
                .setImage(d.image)
                .addField('Episode', `${d.episode ?? 'null'}`, true)
                .addField('Frames', `${d.from}-${d.to}`, true)
                .addField('Similarity', `${(d.similarity * 100).toFixed(2)}%`, true)
                .setFooter('Powered by Trace.moe')
            if (d.anilist.title.english) embed.setAuthor({ name: (d.anilist as Anilist).title.english })

            return embed
        })

        const pagination = new Pagination(interaction, pages)
        await pagination.send()
    }
}

@Discord()
export abstract class TraceContext {
    @ContextMenu('MESSAGE', 'Identify on Trace.moe')
    async trace(interaction: ContextMenuInteraction, client: IslaClient): Promise<any> {
        await interaction.deferReply({ ephemeral: true })

        const msg = interaction.options.getMessage('message', true)
        const image = (msg.attachments as Collection<string, MessageAttachment>).first()?.url ?? msg.embeds[0].url
        if (!image) return interaction.editReply('No image found. Due to API limitations I can only recognize the first message attachment. Use `/trace <url>` to search instead.')

        const data = await client.trace.fetchAnime(image, { anilistInfo: true })

        const pages = data.result.map((d: Result) => {
            const embed = new MessageEmbed()
                .setColor(0x9590ee)
                .setTitle((d.anilist as Anilist).title.romaji)
                .setImage(d.image)
                .addField('Episode', `${d.episode ?? 'null'}`, true)
                .addField('Frames', `${d.from}-${d.to}`, true)
                .addField('Similarity', `${(d.similarity * 100).toFixed(2)}%`, true)
                .setFooter('Powered by Trace.moe')
            if (d.anilist.title.english) embed.setAuthor({ name: (d.anilist as Anilist).title.english })

            return embed
        })

        const pagination = new Pagination(interaction, pages)
        await pagination.send()
    }
}
