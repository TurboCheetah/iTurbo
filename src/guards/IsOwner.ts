import { CommandInteraction } from 'discord.js'
import { GuardFunction } from 'discordx'

export const IsOwner: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
  if (interaction?.member?.user?.id === process.env.OWNER_ID) {
    await next()
  }
}
