import { CommandInteraction, MessageEmbed, TextBasedChannel } from 'discord.js'
import { Discord, Slash } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class NomCommand {
    @Slash('nom', { description: 'Nom nom' })
    async nom(interaction: CommandInteraction, client: IslaClient): Promise<void> {
        await interaction.deferReply()

        const { url } = await client.taihou.toph.getRandomImage('nom', { nsfw: client.utils.isNSFW(interaction.channel as TextBasedChannel) })
        const embed = new MessageEmbed().setColor(0x9590ee).setImage(url)
        interaction.editReply({ embeds: [embed] })
    }
}
