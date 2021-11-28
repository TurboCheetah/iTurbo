import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import c from '@aero/centra'

@Discord()
export abstract class WolframCommand {
    @Slash('wolfram', { description: 'Query Wolfram|Alpha with any mathematical question' })
    async wolfram(
        @SlashOption('query', { description: "What you'd like solved", required: true })
        query: string,
        @SlashOption('public', { description: 'Display this command publicly', required: false })
        ephemeral: boolean,
        interaction: CommandInteraction
    ): Promise<any> {
        await interaction.deferReply({ ephemeral: !ephemeral })

        const { queryresult } = await c('http://api.wolframalpha.com/v2/query', 'GET')
            .query({
                input: query,
                primary: true,
                appid: process.env.WOLFRAM_APPID,
                output: 'json'
            })
            .json()

        if (!queryresult.pods || queryresult.pods.error) return interaction.editReply("Couldn't find an answer to that question!")

        const embed = new MessageEmbed().setColor(0x9590ee).setTitle(queryresult.pods[0].subpods[0].plaintext).setDescription(queryresult.pods[1].subpods[0].plaintext.substring(0, 1950))

        interaction.editReply({ embeds: [embed] })
    }
}
