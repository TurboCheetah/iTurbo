import { CommandInteraction, GuildMember, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '../../Client'
import { isNSFW } from '../../utils/utils'

@Discord()
export abstract class LickCommand {
  @Slash('lick', { description: 'Lick someone' })
  async lcik(
    @SlashOption('user', { description: "The user who you'd like to lcik", required: true })
    member: GuildMember,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    if (member === (interaction.member as GuildMember)) return await interaction.reply({ content: "You can't lcik yourself!", ephemeral: true })

    await interaction.deferReply()

    const { url } = await client.taihou.toph.getRandomImage('lick', { nsfw: isNSFW(interaction.channel as TextBasedChannels) })
    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setDescription(`**${(interaction.member as GuildMember).displayName}** licked **${member.displayName}**`)
      .setImage(url)
    interaction.editReply({ embeds: [embed] })
  }
}
