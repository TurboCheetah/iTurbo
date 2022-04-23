/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Discord, ArgsOf, On } from 'discordx'
import { IslaClient } from '#/Client'
import { Logger } from '#utils/Logger'
import { CommandInteraction } from 'discord.js'

@Discord()
export abstract class InteractionCreateEvent {
    @On('interactionCreate')
    async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: IslaClient): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            switch (interaction.type) {
                case 'APPLICATION_COMMAND':
                    Logger.warn(`${interaction.user.tag} ran command ${(interaction as CommandInteraction).commandName} in ${interaction.guild} (${interaction.guildId})`)
                    break

                case 'MESSAGE_COMPONENT':
                    interaction.isButton() ? Logger.warn(`${interaction.user.tag} pressed button with ID ${interaction.customId} in ${interaction.guild} (${interaction.guildId})`) : Logger.warn(`${interaction.user.tag} ran interaction with type ${interaction.type} in ${interaction.guild} (${interaction.guildId})`)
                    break
                default:
                    Logger.warn(`${interaction.user.tag} ran interaction with type ${interaction.type} in ${interaction.guild} (${interaction.guildId})`)
                    break
            }
        }
        client.executeInteraction(interaction)
    }
}
