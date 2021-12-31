import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import { time, TimestampStyles } from '@discordjs/builders'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export abstract class UserInfoCommand {
    @Slash('userinfo', { description: 'Retrieve information on the desired user' })
    async userinfo(
        @SlashOption('user', { description: "The user whose information you'd like to view", required: false })
        member: GuildMember,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        if (!member) member = interaction.member as GuildMember

        const created = time(member.user.createdAt, TimestampStyles.ShortDateTime)
        const createdR = time(member.user.createdAt, TimestampStyles.RelativeTime)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const joined = time(member.joinedAt!, TimestampStyles.ShortDateTime)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const joinedR = time(member.joinedAt!, TimestampStyles.RelativeTime)

        const embed = new MessageEmbed()
            .setAuthor({ name: `${member.user.tag} ${member.nickname ? `(${member.nickname})` : ''}`, iconURL: member.user.displayAvatarURL({ size: 128, dynamic: true }) })
            .setColor(member.roles.cache.size > 1 ? member.displayHexColor : 0x9590ee)
            .setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true }))
            .addField('Discord Join Date', `${created} (${createdR})`, true)
            .addField('Server Join Date', `${joined} (${joinedR})`, true)
            .addField(
                `Roles (${member.roles.cache.size - 1})`,
                member.roles.cache.size > 1
                    ? member.roles.cache
                          .filter(r => r.name !== '@everyone')
                          .map(r => r)
                          .join(', ')
                    : 'None',
                false
            )
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            .addField('Highest Role', member.roles.highest ? `${member.roles.highest}` : 'None', true)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            .addField('Hoist Role', member.roles.hoist ? `${member.roles.hoist}` : 'None', true)
            .setFooter({ text: `ID: ${member.user.id}` })

        interaction.editReply({ embeds: [embed] })
    }
}
