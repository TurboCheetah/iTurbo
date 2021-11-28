import { Discord, ArgsOf, On } from 'discordx'
import { IslaClient } from '#/Client'

@Discord()
export abstract class InteractionCreateEvent {
    @On('interactionCreate')
    async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: IslaClient): Promise<void> {
        client.executeInteraction(interaction)
    }
}
