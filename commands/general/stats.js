const Command = require('../../structures/Command.js')
const { MessageEmbed, version } = require('discord.js')
const io = require('@pm2/io')

class Stats extends Command {
  constructor (...args) {
    super(...args, {
      description: 'View bot statistics and information.',
      aliases: ['info', 'uptime'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx) { // eslint-disable-line no-unused-vars
    const { client } = this // Avoid typing a lot of 'this'

    // Import PM2 package to take custom metrics
    const commandsRan = io.metric({
      name: 'Commands Ran',
      id: 'commandsRan'
    })

    commandsRan.set(this.store.ran)

    const totalGuilds = io.metric({
      name: 'Guilds',
      id: 'totalGuilds'
    })

    totalGuilds.set(client.guilds.cache.size)

    const totalUsers = io.metric({
      name: 'Users',
      id: 'totalUsers'
    })

    totalUsers.set(this.client.guilds.cache.reduce((sum, guild) => sum + (guild.available ? guild.memberCount : 0), 0))

    const seconds = Math.floor(client.uptime / 1000) % 60
    const minutes = Math.floor((client.uptime / (1000 * 60)) % 60)
    const hours = Math.floor((client.uptime / (1000 * 60 * 60)) % 24)
    const days = Math.floor((client.uptime / (1000 * 60 * 60 * 24)) % 7)
    const uptime = [`${days} Days`,
      `${hours} Hours`,
      `${minutes} Minutes`,
      `${seconds} Seconds`].filter((time) => !time.startsWith('0')).join(', ')

    return ctx.reply(new MessageEmbed()
      .setTitle('iTurbo - Bot Statistics')
      .setDescription("Hi, I'm iTurbo. The all-in-one entertainment bot for your server")
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
      .setColor(0x9590EE)
      .addField('Bot Stats', [
        `**Guilds:** ${client.guilds.cache.size}`,
        `**Users:** ${this.client.guilds.cache.reduce((sum, guild) => sum + (guild.available ? guild.memberCount : 0), 0)}`,
        `**Channels:** ${client.channels.cache.size}`,
        `**Music Streams: ${this.client.distube.guildQueues.map(queue => queue).length}`
        `**Uptime:** ${uptime}`,
        `**Total Memory Usage:** ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        `**Memory Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      ].join('\n'))
      .addField('Versions', [
        `**Bot Version:** ${this.client.version}`,
        `**Node.js Version:** ${process.version}`,
        `**Discord.js Version:** v${version}`
      ].join('\n'))
      .addField('Command Stats', [
        `**Total Commands:** ${this.store.size}`,
        `**Commands Ran:** ${this.store.ran}`
      ].join('\n'))
      .addField('Links', [
        ':envelope_with_arrow: [Invite me to your server](https://discordapp.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot)',
        ':video_game: [Join our Discord Server](https://discord.gg/FFGrsWE)'
      ].join('\n')))
  }
}

module.exports = Stats
