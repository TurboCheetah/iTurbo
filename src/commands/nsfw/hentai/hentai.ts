import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { client } from '../../../index'
import { isNSFW, random } from '../../../utils/utils'

@Discord()
@SlashGroup('hentai', 'Hentai related commands')
export abstract class HentaiCommands {
  @Slash('ass', { description: 'Returns a picture of a hentai ass' })
  async ass(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    if (isNSFW(interaction.channel as TextBasedChannels)) return await interaction.reply('The result I found was NSFW and I cannot post it in this channel.')

    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random('ass', { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('hentai', { description: 'Returns random hentai' })
  async hentai(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    if (isNSFW(interaction.channel as TextBasedChannels)) return await interaction.reply('The result I found was NSFW and I cannot post it in this channel.')

    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random(random(['hentai', 'hentai_gif']), { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('neko', { description: 'Returns lewd neko' })
  async neko(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    if (isNSFW(interaction.channel as TextBasedChannels)) return await interaction.reply('The result I found was NSFW and I cannot post it in this channel.')

    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random('neko', { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }
}