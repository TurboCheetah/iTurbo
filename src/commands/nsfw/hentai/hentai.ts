import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Guard, Slash, SlashGroup, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'
import { IsNsfw } from '#guards/IsNsfw'

@Discord()
@SlashGroup('hentai', 'Hentai related commands')
export abstract class HentaiCommands {
  @Slash('ass', { description: 'Returns a picture of a hentai ass' })
  @Guard(IsNsfw)
  async ass(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random('ass', { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('hentai', { description: 'Returns random hentai' })
  @Guard(IsNsfw)
  async hentai(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random(client.utils.random(['hentai', 'hentai_gif']), { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }

  @Slash('neko', { description: 'Returns lewd neko' })
  @Guard(IsNsfw)
  async neko(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: !ephemeral })
    const res = await client.ksoft.images.random('neko', { nsfw: true })

    const embed = new MessageEmbed().setColor(0x9590ee).setImage(res.url).setFooter('Powered by KSoft.Si')

    interaction.editReply({ embeds: [embed] })
  }
}
