const Command = require('../../structures/Command.js')
const { MessageEmbed, version } = require('discord.js')
const { hostname, totalmem, cpus, loadavg } = require('os')
const io = require('@pm2/io')

class Stats extends Command {
  constructor(...args) {
    super(...args, {
      description: 'View bot statistics and information.',
      aliases: ['info', 'uptime'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    // eslint-disable-line no-unused-vars
    const { client } = this // Avoid typing a lot of 'this'

    // Import PM2 package to take custom metrics
    const commandsRan = io.metric({
      name: 'Commands Ran',
      id: 'commandsRan'
    })

    const ran = (await this.client.shard.fetchClientValues('commands.ran')).reduce((acc, ran) => acc + ran, 0)
    commandsRan.set(ran)

    const guilds = (await this.client.shard.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0)
    const totalGuilds = io.metric({
      name: 'Guilds',
      id: 'totalGuilds'
    })

    totalGuilds.set(guilds)

    const users = (await this.client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')).reduce((acc, memberCount) => acc + memberCount, 0)
    const totalUsers = io.metric({
      name: 'Users',
      id: 'totalUsers'
    })

    totalUsers.set(users)

    const seconds = Math.floor(client.uptime / 1000) % 60
    const minutes = Math.floor((client.uptime / (1000 * 60)) % 60)
    const hours = Math.floor((client.uptime / (1000 * 60 * 60)) % 24)
    const days = Math.floor((client.uptime / (1000 * 60 * 60 * 24)) % 7)
    const uptime = [`${days} Days`, `${hours} Hours`, `${minutes} Minutes`, `${seconds} ${seconds > 1 ? 'Seconds' : 'Second'}`].filter(time => !time.startsWith('0')).join(', ')
    const total = (totalmem() / 1024 / 1024 / 1024).toFixed(0) * 1024
    const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)

    const msg = await ctx.reply('Fetching stats...')
    msg.delete()

    return ctx.reply(
      new MessageEmbed()
        .setTitle(`${this.client.user.username.replace(/Bot/gi, '')} - Bot Statistics`)
        .setDescription("Hi, I'm iTurbo. The all-in-one entertainment bot for your server")
        .setThumbnail(this.client.user.displayAvatarURL({ size: 512, dynamic: true }))
        .setColor(0x9590ee)
        .addField('Bot Stats', [`Guilds: **${guilds}**`, `Users: **${users}**`, `Channels: **${(await this.client.shard.fetchClientValues('channels.cache.size')).reduce((acc, channelCount) => acc + channelCount, 0)}**`, `Shards: **${this.client.shard.count}**`, `Music Streams: **${(await this.client.shard.fetchClientValues('manager.players.size')).reduce((acc, playerCount) => acc + playerCount, 0)}**`, `Uptime: **${uptime}**`, `Ping: **${msg.createdTimestamp - ctx.message.createdTimestamp}ms (API: ${this.client.ws.ping}ms)**`].join('\n'), true)
        // eslint-disable-next-line prettier/prettier
        .addField('Host Stats', [`Container Hostname: **${hostname}**`, `CPU Usage: **${(loadavg()[0] * 100).toFixed(1)}% (${cpus().length}c @ ${(cpus()[0].speed / 1000).toFixed(1)}GHz)**`, `Load Average: **${loadavg().map(avg => avg.toFixed(2)).join(', ')}**`, `Memory Usage: **${((usage / total) * 100).toFixed(1)}% (${usage.toLocaleString()} / ${total.toLocaleString()} MB)**`].join('\n'), true)
        .addField(this.client.constants.zws, this.client.constants.zws, true)
        .addField('Versions', [`Bot Version: **${this.client.version}**`, `Node.js Version: **${process.version}**`, `Discord.js Version: **v${version}**`].join('\n'), true)
        .addField('Command Stats', [`Total Commands: **${this.store.size}**`, `Commands Ran: **${ran}**`].join('\n'), true)
        .addField(this.client.constants.zws, this.client.constants.zws, true)
        .addField('Useful Links', ['**📩 [Invite me to your server](https://discordapp.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot)** • **🎮 [Join our Discord Server](https://discord.gg/011UYuval0uSxjmuQ)** • **📖 [Documentation](https://docs.iturbo.cc)**'].join('\n'), true)
        .setFooter(`Requested by ${ctx.author.tag} • Shard ${this.client.shard.ids[0]}`)
        .setTimestamp()
    )
  }
}

module.exports = Stats
