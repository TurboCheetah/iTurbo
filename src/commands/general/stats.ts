/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommandInteraction, Message, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { IslaClient } from '../../Client'
import { cpus, hostname, loadavg, totalmem } from 'os'

@Discord()
export abstract class StatsCommand {
  @Slash('stats', { description: "Retrieves the bot's statistics" })
  async stats(
    @SlashOption('public', { description: 'Display this command publicly', required: false })
    ephemeral: boolean,
    interaction: CommandInteraction,
    client: IslaClient
  ): Promise<void> {
    const reply = (await interaction.deferReply({ fetchReply: true, ephemeral: !ephemeral })) as Message

    const guilds = ((await client.shard?.fetchClientValues('guilds.cache.size')) as number[]).reduce((acc, guildCount) => acc + guildCount, 0)
    const users = ((await client.shard?.fetchClientValues('users.cache.size')) as number[]).reduce((acc, userCount) => acc + userCount, 0)
    const channels = ((await client.shard?.fetchClientValues('channels.cache.size')) as number[]).reduce((acc, channelCount) => acc + channelCount, 0)
    const shards = client.shard?.shards.length ?? 1
    const ping = reply.createdTimestamp - interaction.createdTimestamp

    const seconds = Math.floor(client.uptime! / 1000) % 60
    const minutes = Math.floor((client.uptime! / (1000 * 60)) % 60)
    const hours = Math.floor((client.uptime! / (1000 * 60 * 60)) % 24)
    const days = Math.floor((client.uptime! / (1000 * 60 * 60 * 24)) % 7)
    const uptime = [`${days} Days`, `${hours} Hours`, `${minutes} Minutes`, `${seconds} ${seconds > 1 ? 'Seconds' : 'Second'}`].filter(time => !time.startsWith('0')).join(', ')

    const total = +(totalmem() / 1024 / 1024 / 1024).toFixed(0) * 1024
    const usage = +((await client.shard?.broadcastEval(client => process.memoryUsage().heapUsed / 1024 / 1024))?.reduce((acc, memUsage) => acc + memUsage, 0).toFixed(2) as string)

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle('Stats')
      .addField('Bot Stats', [`Guilds: **${guilds}**`, `Users: **${users}**`, `Channels: **${channels}**`, `Shards: **${shards}**`, `Clusters: **${client.cluster?.manager.clusterCount as number}**`, `Uptime: **${uptime}**`, `Ping: **${ping}ms**`, `API Latency: **${client.ws.ping}ms**`].join('\n'), true)
      .addField(client.constants.zws, client.constants.zws, true)
      .addField(
        'Host Stats',
        [
          `Hostname: **${hostname()}**`,
          `CPU Usage: **${(loadavg()[0] * 100).toFixed(1)}% (${cpus().length}c @ ${(cpus()[0].speed / 1000).toFixed(1)}GHz)**`,
          `Load Average: **${loadavg()
            .map(avg => avg.toFixed(2))
            .join(', ')}**`,
          `Memory Usage: **${((usage / total) * 100).toFixed(1)}% (${usage.toLocaleString()} / ${total.toLocaleString()} MB)**`
        ].join('\n'),
        true
      )
      .setFooter(`Cluster ${client.cluster?.id as number} • Shard ${client.shard?.id as number}`)
      .setTimestamp()

    interaction.editReply({ embeds: [embed] })
  }
}
