import { Pagination } from '@discordx/utilities'
import { search } from 'booru'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Guard, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'
import { IsNsfw } from '#guards/IsNsfw'

@Discord()
export abstract class Rule34Command {
  @Slash('rule34', { description: "Rule 34: If it exists there's porn of it" })
  @Guard(IsNsfw)
  async rule34(
    @SlashOption('query', { description: "What you'd like to search for", required: true })
    query: string,
    @SlashOption('animated', { description: 'Do you want videos/gifs?', required: false })
    animated: boolean,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<any> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const q = query
      .replace(/\s/g, '_')
      .split('_|_')
      .filter(tag => tag !== 'animated')
      .concat(animated ? 'animated' : '-animated')

    const [...posts] = await search('rule34', q, { limit: animated ? 1 : 10, random: true })

    if (posts === null) return interaction.editReply('No results were found.')

    if (animated && posts[0].fileUrl !== null) return interaction.editReply(posts[0].fileUrl)

    const pages = posts
      .filter(post => post.fileUrl !== null && !post.fileUrl.endsWith('.webm') && !post.fileUrl.endsWith('.mp4'))
      .map(post => {
        return (
          new MessageEmbed()
            .setTitle(`Score: ${post.score}`)
            .addField('Tags', client.utils.shorten(post.tags.join(' ')))
            .setColor(0x9590ee)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .setImage(post.fileUrl!)
            .setFooter('Powered by Rule34.XXX')
        )
      })

    const pagination = new Pagination(interaction, pages)
    await pagination.send()

    // interaction.editReply({ embeds: [embed] })
  }
}
