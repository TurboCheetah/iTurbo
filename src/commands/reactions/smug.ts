import { CommandInteraction, MessageEmbed, TextBasedChannels } from 'discord.js'
import { Discord, Slash } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class SmugCommand {
    @Slash('smug', { description: 'Smug' })
    async smug(interaction: CommandInteraction, client: IslaClient): Promise<void> {
        await interaction.deferReply()

        const { url } = await client.taihou.toph.getRandomImage('smug', { nsfw: client.utils.isNSFW(interaction.channel as TextBasedChannels) })
        const embed = new MessageEmbed().setColor(0x9590ee).setImage(url)
        interaction.editReply({ embeds: [embed] })
    }
}
