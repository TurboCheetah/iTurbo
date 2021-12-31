import centra from '@aero/centra'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Guard, Slash, SlashOption } from 'discordx'
import { IsNsfw } from '#guards/IsNsfw'
import { OBoobs } from '#types/oboobs.type'

@Discord()
export abstract class ButtCommand {
    @Slash('butt', { description: 'Returns a picture of a butt' })
    @Guard(IsNsfw)
    async butt(
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: !ephemeral })
        const [data]: [OBoobs] = await centra('http://api.obutts.ru/butts/0/1/random', 'GET').json()

        const embed = new MessageEmbed().setColor(0x9590ee).addField('ID', `${data.id}`, true).addField('Rank', `${data.rank}`, true).setImage(`http://media.obutts.ru/${data.preview}`).setFooter({ text: 'Powered by oBoobs.ru' })
        if (data.model !== null) embed.setTitle(data.model)
        interaction.editReply({ embeds: [embed] })
    }
}
