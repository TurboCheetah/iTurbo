/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js'
import { Discord, Guard, Slash, SlashOption } from 'discordx'
import { IsOwner } from '../../guards/IsOwner'
import { Bot } from '../../Client'
import { inspect } from 'util'

@Discord()
export abstract class EvalCommand {
  @Slash('eval', { description: 'Evaluates some code' })
  @Guard(IsOwner)
  async eval(@SlashOption('code', { description: 'The code to evaluate', required: true }) code: string, interaction: CommandInteraction, client: Bot): Promise<void> {
    await interaction.deferReply({ ephemeral: true })

    const isAsync: boolean = code.includes('await') || code.includes('return')
    const before: number = Date.now()
    let evaled: string
    let type: string

    try {
      evaled = await eval(isAsync ? `const client = ${client},interaction = ${interaction};(async()=>{${code}})()` : code)
      type = typeof evaled
    } catch (error) {
      evaled = (error as Error).message
      type = 'unknown'
    }

    const evalTime = Date.now() - before
    if (type !== 'string') evaled = inspect(evaled, { depth: 0 })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = new RegExp(client.token!, 'gi')
    evaled = evaled.replace(token, '[TOKEN]')

    const embed = new MessageEmbed()
      .setColor(0x36ed82)
      .setTitle(type)
      .setDescription(Formatters.codeBlock('js', evaled.length > 1900 ? 'Too long to print' : evaled))
      .setFooter(`Latency: ${evalTime}ms`)

    interaction.editReply({ embeds: [embed] })
  }
}
