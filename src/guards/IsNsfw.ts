import { CommandInteraction, TextBasedChannels } from 'discord.js'
import { GuardFunction } from 'discordx'
import { Utils } from '#utils/Utils'

export const IsNsfw: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
    if (Utils.isNSFW(interaction.channel as TextBasedChannels)) {
        await next()
    } else {
        return interaction.reply({ content: 'Please re-run this command in an NSFW channel!', ephemeral: true })
    }
}
