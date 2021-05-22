const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { hostname, totalmem, cpus, loadavg } = require('os')

class Stats extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('statsDescription'),
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
    const uptime = ctx.language.get('statsUptimeArr', days, hours, minutes, seconds).filter(time => !time.startsWith('0')).join(', ')
    const total = (totalmem() / 1024 / 1024 / 1024).toFixed(0) * 1024
    const usage = (await this.client.shard.broadcastEval('(process.memoryUsage().heapUsed / 1024 / 1024)')).reduce((acc, memUsage) => acc + memUsage, 0).toFixed(2)
    const nodes = this.client.manager.nodes.map(node => node)
    let musicStreams = 0
    for (const node of nodes) {
      musicStreams += node.stats.playingPlayers
    }

    const msg = await ctx.reply(ctx.language.get('statsFetching'))
    msg.delete()

    return ctx.reply(
      new MessageEmbed()
        .setTitle(ctx.language.get('statsTitle'))
        .setDescription(ctx.language.get('statsDesc'))
        .setThumbnail(this.client.user.displayAvatarURL({ size: 512, dynamic: true }))
        .setColor(this.client.constants.color)
        .addField(ctx.language.get('statsBot'), [ctx.language.get('statsGuilds', guilds), ctx.language.get('statsUsers', users), ctx.language.get('statsChannels', (await this.client.shard.fetchClientValues('channels.cache.size')).reduce((acc, channelCount) => acc + channelCount, 0)), ctx.language.get('statsShards', this.client.shard.count), ctx.language.get('statsStreams', musicStreams), ctx.language.get('statsUptime', uptime), ctx.language.get('statsPing', msg.createdTimestamp - ctx.message.createdTimestamp, this.client.ws.ping)].join('\n'), true)
        .addField(this.client.constants.zws, this.client.constants.zws, true)
        // eslint-disable-next-line prettier/prettier
        .addField(ctx.language.get('statsHost'), [ctx.language.get('statsHostname', hostname), ctx.language.get('statsCPU', `${(loadavg()[0] * 100).toFixed(1)}% (${cpus().length}c @ ${(cpus()[0].speed / 1000).toFixed(1)}GHz)`), ctx.language.get('statsLoadAverage', loadavg().map(avg => avg.toFixed(2)).join(', ')), ctx.language.get('statsMemUsage', `${((usage / total) * 100).toFixed(1)}% (${usage.toLocaleString()} / ${total.toLocaleString()} MB)`)].join('\n'), true)
        // Remove clutter
        /*
        .addField('Versions', [`Bot Version: **${this.client.version}**`, `Node.js Version: **${process.version}**`, `Discord.js Version: **v${version}**`].join('\n'), true)
        .addField('Command Stats', [`Total Commands: **${this.store.size}**`, `Commands Ran: **${ran}**`].join('\n'), true)
        .addField(this.client.constants.zws, this.client.constants.zws, true)
        .addField('Useful Links', ['**📩 [Invite me to your server](https://discordapp.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot)** • **🎮 [Join our Discord Server](https://discord.gg/011UYuval0uSxjmuQ)** • **📖 [Documentation](https://docs.iturbo.cc)**'].join('\n'), true)
         */
        .setFooter(ctx.language.get('statsFooter', this.client.version, this.client.shard.ids[0]))
        .setTimestamp()
    )
  }
}

module.exports = Stats
