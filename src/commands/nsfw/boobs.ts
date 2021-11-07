import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { isNSFW } from '../../utils/utils'
import centra from '@aero/centra'
import { OBoobs } from '../../types/oboobs.type'

@Discord()
export abstract class BoobsCommand {
  @Slash('boobs', { description: 'Returns a picture of boobs' })
  async boobs(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    if (isNSFW(interaction.channel as TextBasedChannels)) return await interaction.reply('The result I found was NSFW and I cannot post it in this channel.')

    await interaction.deferReply({ ephemeral: !ephemeral })
    const [data]: [OBoobs] = await centra('http://api.oboobs.ru/boobs/0/1/random', 'GET').json()

    const embed = new MessageEmbed().setColor(0x9590ee).addField('ID', `${data.id}`, true).addField('Rank', `${data.rank}`, true).setImage(`http://media.oboobs.ru/${data.preview}`).setFooter('Powered by oBoobs.ru')
    if (data.model !== null) embed.setTitle(data.model)
    interaction.editReply({ embeds: [embed] })
  }
}
