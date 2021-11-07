import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, MetadataStorage, Slash } from 'discordx'
import { Pagination } from '@discordx/utilities'
import { toProperCase } from '../../utils/utils'

@Discord()
export abstract class HelpCommand {
  @Slash('help', { description: 'View a list of all commands' })
  async pages(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true })

    const commands = MetadataStorage.instance.applicationCommands.map(cmd => {
      return { name: cmd.name, description: cmd.description }
    })

    const pages = commands.map((cmd, i) => {
      return new MessageEmbed()
        .setColor(0x9590ee)
        .setTitle(`**${toProperCase(cmd.name)}**`)
        .setDescription(cmd.description)
        .setFooter(`Command ${i + 1} of ${commands.length}`)
    })

    const pagination = new Pagination(interaction, pages)
    await pagination.send()
  }
}
