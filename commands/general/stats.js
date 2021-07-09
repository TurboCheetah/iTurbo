const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { hostname, totalmem, cpus, loadavg } = require('os')

class Stats extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/general/stats:description'),
      aliases: ['info', 'uptime'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { client } = this // Avoid typing a lot of 'this'

    // const ran = (await this.client.shard.fetchClientValues('commands.ran')).reduce((acc, ran) => acc + ran, 0)

    const guilds = (await this.client.shard.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0)

    const users = (await this.client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')).reduce((acc, memberCount) => acc + memberCount, 0)

    const seconds = Math.floor(client.uptime / 1000) % 60
    const minutes = Math.floor((client.uptime / (1000 * 60)) % 60)
    const hours = Math.floor((client.uptime / (1000 * 60 * 60)) % 24)
    const days = Math.floor((client.uptime / (1000 * 60 * 60 * 24)) % 7)
    const uptime = ctx.translate('commands/general/stats:uptimeArr', { days: days, hours: hours, minutes: minutes, seconds: seconds, plural: seconds > 1 ? 'Seconds' : 'Second' }).filter(time => !time.startsWith('0')).join(', ')
    const total = (totalmem() / 1024 / 1024 / 1024).toFixed(0) * 1024
    const usage = (await this.client.shard.broadcastEval('(process.memoryUsage().heapUsed / 1024 / 1024)')).reduce((acc, memUsage) => acc + memUsage, 0).toFixed(2)
    const nodes = this.client.manager.nodes.map(node => node)
    let musicStreams = 0
    for (const node of nodes) {
      musicStreams += node.stats.playingPlayers
    }

    const msg = await ctx.tr('commands/general/suggestion:fetching')
    msg.delete()

    return ctx.reply(
      new MessageEmbed()
        .setTitle(ctx.translate('commands/general/stats:title'))
        .setDescription(ctx.translate('commands/general/stats:desc'))
        .setThumbnail(this.client.user.displayAvatarURL({ size: 512, dynamic: true }))
        .setColor(this.client.constants.color)
        .addField(ctx.translate('commands/general/stats:bot'), [ctx.translate('commands/general/stats:guilds', { guilds }), ctx.translate('commands/general/stats:users', { users }), ctx.translate('commands/general/stats:channels', { channels: (await this.client.shard.fetchClientValues('channels.cache.size')).reduce((acc, channelCount) => acc + channelCount, 0) }), ctx.translate('commands/general/stats:shards', { shards: this.client.shard.count }), ctx.translate('commands/general/stats:streams', { streams: musicStreams }), ctx.translate('commands/general/stats:uptime', { uptime }), ctx.translate('commands/general/stats:ping', { ping: msg.createdTimestamp - ctx.message.createdTimestamp, api: this.client.ws.ping })].join('\n'), true)
        .addField(this.client.constants.zws, this.client.constants.zws, true)
        // eslint-disable-next-line prettier/prettier
        .addField(ctx.translate('commands/general/stats:host'), [ctx.translate('commands/general/stats:hostname', { hostname }), ctx.translate('commands/general/stats:cpu', { usage: `${(loadavg()[0] * 100).toFixed(1)}% (${cpus().length}c @ ${(cpus()[0].speed / 1000).toFixed(1)}GHz)` }), ctx.translate('commands/general/stats:loadAverage', { load: loadavg().map(avg => avg.toFixed(2)).join(', ') }), ctx.translate('commands/general/stats:memUsage', { usage: `${((usage / total) * 100).toFixed(1)}% (${usage.toLocaleString()} / ${total.toLocaleString()} MB)` })].join('\n'), true)
        // Remove clutter
        /*
        .addField('Versions', [`Bot Version: **${this.client.version}**`, `Node.js Version: **${process.version}**`, `Discord.js Version: **v${version}**`].join('\n'), true)
        .addField('Command Stats', [`Total Commands: **${this.store.size}**`, `Commands Ran: **${ran}**`].join('\n'), true)
        .addField(this.client.constants.zws, this.client.constants.zws, true)
        .addField('Useful Links', ['**📩 [Invite me to your server](https://discordapp.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot)** • **🎮 [Join our Discord Server](https://discord.gg/011UYuval0uSxjmuQ)** • **📖 [Documentation](https://docs.iturbo.cc)**'].join('\n'), true)
         */
        .setFooter(ctx.translate('commands/general/stats:footer', { version: this.client.version, shard: this.client.shard.ids[0] }))
        .setTimestamp()
    )
  }
}

module.exports = Stats
