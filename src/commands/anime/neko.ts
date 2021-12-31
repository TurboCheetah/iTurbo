import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import centra from '@aero/centra'

@Discord()
export abstract class NekoCommand {
    @Slash('neko', { description: 'Returns a SFW neko picture' })
    async neko(
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const { url } = await centra('https://nekos.life/api/v2/img/neko', 'GET').json()

        const embed = new MessageEmbed().setColor(0x9590ee).setImage(url).setFooter({ text: 'Powered by nekos.life' })

        interaction.editReply({ embeds: [embed] })
    }
}
