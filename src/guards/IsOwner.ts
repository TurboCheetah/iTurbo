import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { CommandInteraction } from 'discord.js'

export const IsOwner: GuardFunction<CommandInteraction | SimpleCommandMessage> = async (arg, client, next) => {
  if (arg instanceof SimpleCommandMessage) {
    if (arg.message.author.id === '120306174225678336') {
      await next()
    }
  } else {
    if (arg?.member?.user?.id === '120306174225678336') {
      await next()
    }
  }
}
