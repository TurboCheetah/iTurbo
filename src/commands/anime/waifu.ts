import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

@Discord()
export abstract class WaifuCommand {
    @Slash('waifu', { description: 'Returns a randomly generated Waifu from thiswaifudoesnotexist.net' })
    async waifu(
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const embed = new MessageEmbed().setColor(0x9590ee).setImage(`https://www.thiswaifudoesnotexist.net/example-${Math.floor(Math.random() * 100000)}.jpg`)

        interaction.editReply({ embeds: [embed] })
    }
}
