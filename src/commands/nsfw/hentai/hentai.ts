import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { IslaClient } from '../../../Client'
import { isNSFW, random } from '../../../utils/utils'

@Discord()
@SlashGroup('hentai', 'Hentai related commands')
export abstract class HentaiCommands {
  @Slash('ass', { description: 'Returns a picture of a hentai ass' })
  async ass(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    if (!isNSFW(interaction.channel as TextBasedChannels) && ephemeral) return await interaction.reply({ content: 'Please re-run this command with private mode enabled or in an NSFW channel!', ephemeral: true })

    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random('ass', { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('hentai', { description: 'Returns random hentai' })
  async hentai(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    if (!isNSFW(interaction.channel as TextBasedChannels) && ephemeral) return await interaction.reply({ content: 'Please re-run this command with private mode enabled or in an NSFW channel!', ephemeral: true })

    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random(random(['hentai', 'hentai_gif']), { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('neko', { description: 'Returns lewd neko' })
  async neko(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    if (!isNSFW(interaction.channel as TextBasedChannels) && ephemeral) return await interaction.reply({ content: 'Please re-run this command with private mode enabled or in an NSFW channel!', ephemeral: true })

    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random('neko', { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }
}
