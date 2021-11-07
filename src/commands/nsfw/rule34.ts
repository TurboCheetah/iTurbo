import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { search } from 'booru'
import { isNSFW, shorten } from '../../utils/utils'

@Discord()
export abstract class Rule34Command {
  @Slash('rule34', { description: "Rule 34: If it exists there's porn of it" })
  async rule34(
    @SlashOption('query', { description: "What you'd like to search for", required: true })
    query: string,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<any> {
    if (isNSFW(interaction.channel as TextBasedChannels)) return await interaction.reply('The result I found was NSFW and I cannot post it in this channel.')

    await interaction.deferReply({ ephemeral: !ephemeral })

    const [posts] = await search('rule34', query.split(' ').join('_').split('_|_'), { limit: 1, random: true })

    if (posts === null || posts.file_url === null) return await interaction.editReply('No results were found.')

    if (posts.file_url?.endsWith('webm')) {
      return await interaction.editReply(`Score: ${posts.score}\n${posts.file_url}`)
    }

    const embed = new MessageEmbed()
      .setTitle(`Score: ${posts.score}`)
      .addField('Tags', shorten(posts.tags.join(' ')))
      .setColor(0x9590ee)
      .setImage(posts.file_url)
      .setFooter('Powered by Rule34.XXX')

    interaction.editReply({ embeds: [embed] })
  }
}
