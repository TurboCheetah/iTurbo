import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export abstract class TopInvitesCommand {
    @Slash('topinvites', { description: 'Shows the top inviters in the server' })
    async topinvites(
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const invites = await interaction.guild?.invites.fetch()
        const topTen = invites
            ? invites
                  .filter(inv => (inv.uses ? inv.uses > 0 : false))
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  .sort((a, b) => b.uses! - a.uses!)
                  .first(10)
            : null
        console.log(topTen)

        if (!topTen || !topTen.length) return interaction.editReply('There are no invites or none of them have been used!')

        const embed = new MessageEmbed()
            .setColor(0x9590ee)
            .setTitle('Top Invites')
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .setAuthor({ name: interaction.guild!.name, iconURL: interaction.guild!.iconURL({ size: 128, dynamic: true }) as string })
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .setDescription(topTen.map(inv => `• **${inv.inviter!.username}**'s invite **${inv.code}** has **${inv.uses!.toLocaleString()}** uses.`).join('\n'))

        interaction.editReply({ embeds: [embed] })
    }
}
