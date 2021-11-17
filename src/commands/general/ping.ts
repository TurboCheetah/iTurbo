import { CommandInteraction, Message, MessageEmbed } from 'discord.js'
import { Discord, Slash } from 'discordx'

@Discord()
export abstract class PingCommand {
  @Slash('ping', { description: 'Pings the bot' })
  async ping(interaction: CommandInteraction): Promise<void> {
    const reply = (await interaction.deferReply({ fetchReply: true, ephemeral: true })) as Message
    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle('Pong 🏓')
      .addField('Roundtrip', `${reply.createdTimestamp - interaction.createdTimestamp}ms`, true)
      .addField('Websocket', `${interaction.client.ws.ping}ms`, true)
    interaction.editReply({ embeds: [embed] })
  }
}
