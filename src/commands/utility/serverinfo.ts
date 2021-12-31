import { CommandInteraction, MessageEmbed } from 'discord.js'
import { time, TimestampStyles } from '@discordjs/builders'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class ServerInfoCommand {
    @Slash('serverinfo', { description: 'Retrieve information on the desired user' })
    async serverinfo(
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction,
        client: IslaClient
    ): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const guild = interaction.guild!

        await interaction.deferReply({ ephemeral: !ephemeral })

        const verificationLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '(╯°□°）╯︵ ┻━┻',
            VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        }

        const filterLevels = {
            DISABLED: 'Off',
            MEMBERS_WITHOUT_ROLES: 'No Role',
            ALL_MEMBERS: 'Everyone'
        }

        const created = time(guild.createdAt, TimestampStyles.ShortDateTime)
        const createdR = time(guild.createdAt, TimestampStyles.RelativeTime)

        const bans = await guild.bans
            .fetch()
            .then(bans => bans.size)
            .catch(() => "Couldn't fetch bans.")

        const owner = await guild.fetchOwner()

        const embed = new MessageEmbed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ size: 128, dynamic: true }) as string })
            .setColor(0x9590ee)
            .setThumbnail(guild.iconURL({ size: 512, dynamic: true }) as string)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            .addField('Members', `• **${guild.memberCount}** member(s)\n• Owner: **${owner.user}**`, true)
            .addField(client.constants.zws, client.constants.zws, true)
            .addField('Channels', `• **${guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').map(c => c).length}** Categories, **${guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').map(c => c).length}** Text, **${guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').map(c => c).length}** Voice\n• AFK: **${guild.afkChannel ? guild.afkChannel.name : 'None'}**`, true)
            .addField('Other', `• Created: **${created}** (**${createdR}**)\n• Verification Level: **${verificationLevels[guild.verificationLevel]}**\n• Explicit Filter: **${filterLevels[guild.explicitContentFilter]}**\n• Roles: **${guild.roles.cache.size - 1}**\n• Bans: **${bans}**`, false)
            .setFooter({ text: `ID: ${guild.id}` })

        interaction.editReply({ embeds: [embed] })
    }
}
