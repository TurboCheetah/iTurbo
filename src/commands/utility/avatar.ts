import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export abstract class AvatarCommand {
    @Slash('avatar', { description: "Grab someone's avatar" })
    async avatar(
        @SlashOption('user', { description: "The user whose avatar you'd like to view", required: false })
        member: GuildMember,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        if (!member) member = interaction.member as GuildMember

        const embed = new MessageEmbed()
            .setColor(0x9590ee)
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ size: 256, dynamic: true }) })
            .setImage(member.displayAvatarURL({ size: 2048, dynamic: true }))

        interaction.editReply({ embeds: [embed] })
    }
}
