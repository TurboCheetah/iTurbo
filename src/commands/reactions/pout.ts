import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class PoutCommand {
    @Slash('pout', { description: 'Pout' })
    async pout(interaction: CommandInteraction, client: IslaClient): Promise<void> {
        await interaction.deferReply()

        const { url } = await client.taihou.toph.getRandomImage('pout')
        const embed = new MessageEmbed().setColor(0x9590ee).setImage(url)
        interaction.editReply({ embeds: [embed] })
    }
}
