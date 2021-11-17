import { CommandInteraction, GuildMember, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '../../Client'
import { isNSFW } from '../../utils/utils'

@Discord()
export abstract class HugCommand {
  @Slash('hug', { description: 'Hug someone' })
  async hug(
    @SlashOption('user', { description: "The user who you'd like to hug", required: true })
    member: GuildMember,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    if (member === (interaction.member as GuildMember)) return await interaction.reply({ content: "You can't hug yourself!", ephemeral: true })

    await interaction.deferReply()

    const { url } = await client.taihou.toph.getRandomImage('hug', { nsfw: isNSFW(interaction.channel as TextBasedChannels) })
    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setDescription(`**${(interaction.member as GuildMember).displayName}** hugged **${member.displayName}**`)
      .setImage(url)
    interaction.editReply({ embeds: [embed] })
  }
}
