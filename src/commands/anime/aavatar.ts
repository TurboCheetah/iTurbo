import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { isNSFW } from '../../utils/utils'
import centra from '@aero/centra'

@Discord()
export abstract class AavatarCommand {
  @Slash('aavatar', { description: 'Returns a randomly generated anime avatar' })
  async aavatar(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })

    const { url } = await centra(`https://nekos.life/api/v2/img/${isNSFW(interaction.channel as TextBasedChannels) ? 'nsfw_' : ''}avatar`, 'GET').json()

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(url).setFooter('Powered by nekos.life')

    interaction.editReply({ embeds: [embed] })
  }
}
