import { CommandInteraction, GuildMember, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class StareCommand {
  @Slash('stare', { description: 'Stare into space or at someone' })
  async stare(
    @SlashOption('user', { description: "The user who you'd like to stare at", required: false })
    member: GuildMember,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    if (member && member === (interaction.member as GuildMember)) return interaction.reply({ content: "You can't stare at yourself!", ephemeral: true })

    await interaction.deferReply()

    const { url } = await client.taihou.toph.getRandomImage('stare', { nsfw: client.utils.isNSFW(interaction.channel as TextBasedChannels) })
    const embed = new MessageEmbed().setColor(0x9590ee).setImage(url)
    if (member) embed.setDescription(`**${(interaction.member as GuildMember).displayName}** starred at **${member.displayName}**`)
    interaction.editReply({ embeds: [embed] })
  }
}
