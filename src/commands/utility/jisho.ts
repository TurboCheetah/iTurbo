import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { Pagination } from '@discordx/utilities'
import { toProperCase } from '../../utils/utils'
import c from '@aero/centra'

@Discord()
export abstract class JishoCommand {
  @Slash('jisho', { description: 'Search for a word on Jisho.org' })
  async jisho(
    @SlashOption('word', { description: "The word whose definition you'd like to view", required: true })
    word: string,
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<any> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const { data } = await c(`https://jisho.org/api/v1/search/words`, 'GET').query({ keyword: word }).json()

    if (!data.length) return await interaction.editReply('No results found')

    const pages = data.map(d => {
      return new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle(`${toProperCase(word)}`)
        .setURL(`https://jisho.org/search/${word}`)
        .addField('Japanese', d.japanese[0].word || d.japanese[0].reading, false)
        .addField('Reading', d.japanese[0].reading || d.japanese[0].word, false)
        .addField('English Meaning', `${toProperCase(d.senses[0].english_definitions.join(', '))}`, false)
        .setFooter('Powered by Jisho.org', (interaction.member as GuildMember).displayAvatarURL({ dynamic: true }))
    })

    const pagination = new Pagination(interaction, pages)
    await pagination.send()
  }
}
