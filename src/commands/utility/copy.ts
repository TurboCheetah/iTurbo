import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class CopyCommand {
  @Slash('copy', { description: 'Copies an emoji by id or url' })
  async copy(
    @SlashOption('emoji', { description: "The emoji you'd like to copy", required: true })
    emoji: string,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<any> {
    await interaction.deferReply()

    const e = client.utils.resolveEmoji(emoji)
    if (!e) return interaction.editReply('Invalid emoji')

    const url = `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}`
    await interaction.guild?.emojis.create(url, e.name)

    const embed = new MessageEmbed().setColor(0x9590ee).setTitle(e.name).setImage(url)
    return interaction.editReply({ embeds: [embed] })
  }
}
