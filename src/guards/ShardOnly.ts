import { CommandInteraction } from 'discord.js'
import { GuardFunction } from 'discordx'

export const ShardOnly: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
    if (process.env.NODE_ENV === 'development') return interaction.reply({ content: 'This command cannot be run in development mode!', ephemeral: true })

    await next()
}
