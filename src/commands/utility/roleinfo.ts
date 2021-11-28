import { CommandInteraction, MessageEmbed, Role } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export abstract class RoleInfoCommand {
    @Slash('roleinfo', { description: 'Get information about a role' })
    async roleinfo(
        @SlashOption('role', { description: "The role whose data you'd like to view", required: true })
        role: Role,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const embed = new MessageEmbed()
            .setColor(role.hexColor)
            .setTitle(`${role.name} (${role.id})`)
            .setDescription(`• ID: **${role.id}**\n• Name: **${role.name}**\n• Color: **${role.hexColor}**\n• Hoisted: **${role.hoist ? 'Yes' : 'No'}**\n• Position: **${role.rawPosition}**\n• Mentionable: **${role.mentionable ? 'Yes' : 'No'}**`)
            .addField(
                'Permissions',
                role.permissions.has('ADMINISTRATOR')
                    ? 'All permissions granted'
                    : role.permissions.toArray().length > 0
                    ? `\`\`\`${role.permissions
                          .toArray()
                          .map(perm => `${perm}`)
                          .join(', ')}\`\`\``
                    : 'No permissions granted'
            )

        interaction.editReply({ embeds: [embed] })
    }
}
