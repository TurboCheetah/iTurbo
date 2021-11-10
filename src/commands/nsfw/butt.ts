import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { isNSFW } from '../../utils/utils'
import centra from '@aero/centra'
import { OBoobs } from '../../types/oboobs.type'

@Discord()
export abstract class ButtCommand {
  @Slash('butt', { description: 'Returns a picture of a butt' })
  async butt(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    if (isNSFW(interaction.channel as TextBasedChannels) && ephemeral) return await interaction.reply({ content: 'Please re-run this command with private mode enabled or in an NSFW channel!', ephemeral: true })

    await interaction.deferReply({ ephemeral: !ephemeral })
    const [data]: [OBoobs] = await centra('http://api.obutts.ru/butts/0/1/random', 'GET').json()

    const embed = new MessageEmbed().setColor(0x9590ee).addField('ID', `${data.id}`, true).addField('Rank', `${data.rank}`, true).setImage(`http://media.obutts.ru/${data.preview}`).setFooter('Powered by oBoobs.ru')
    if (data.model !== null) embed.setTitle(data.model)
    interaction.editReply({ embeds: [embed] })
  }
}
