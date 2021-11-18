import { CommandInteraction } from 'discord.js'
import { GuardFunction } from 'discordx'

export const NotABot: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
  if (!interaction?.member?.user?.bot) {
    await next()
  }
}

export async function notBot(message: CommandInteraction): Promise<boolean> {
  return !message?.member?.user?.bot
}
