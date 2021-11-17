import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { search } from 'booru'
import { isNSFW, shorten } from '../../utils/utils'
import { Pagination } from '@discordx/utilities'

@Discord()
export abstract class Rule34Command {
  @Slash('rule34', { description: "Rule 34: If it exists there's porn of it" })
  async rule34(
    @SlashOption('query', { description: "What you'd like to search for", required: true })
    query: string,
    @SlashOption('animated', { description: 'Do you want videos/gifs?', required: false })
    animated: boolean,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<any> {
    if (!isNSFW(interaction.channel as TextBasedChannels) && ephemeral) return interaction.reply({ content: 'Please re-run this command with private mode enabled or in an NSFW channel!', ephemeral: true })

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
            .addField('Tags', shorten(post.tags.join(' ')))
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
