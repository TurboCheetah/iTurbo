import { CommandInteraction, TextBasedChannels } from 'discord.js'
import { GuardFunction } from 'discordx'
import { Utils } from '../utils/Utils'
export const IsNsfw: GuardFunction<CommandInteraction> = async (arg, client, next) => {
  if (Utils.isNSFW(arg.channel as TextBasedChannels)) {
    await next()
  } else {
    return arg.reply({ content: 'Please re-run this command in an NSFW channel!', ephemeral: true })
  }
}
