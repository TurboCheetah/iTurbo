import { CommandInteraction, GuildMember, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class PatCommand {
    @Slash('pat', { description: 'Pat someone' })
    async pat(
        @SlashOption('user', { description: "The user who you'd like to pat" })
        member: GuildMember,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<void> {
        if (member === (interaction.member as GuildMember)) return interaction.reply({ content: "You can't pat yourself!", ephemeral: true })

        await interaction.deferReply()

        const { url } = await client.taihou.toph.getRandomImage('pat', { nsfw: client.utils.isNSFW(interaction.channel as TextBasedChannels) })
        const embed = new MessageEmbed()
            .setColor(0x9590ee)
            .setDescription(`**${(interaction.member as GuildMember).displayName}** patted **${member.displayName}**`)
            .setImage(url)
        interaction.editReply({ embeds: [embed] })
    }
}
