const Command = require('../../structures/Command.js')

class Filter extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Enable or disable a filter. Run the command again to disable a filter.',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'filter <filter>',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run (ctx, args) {
    switch (args[0]) {
      case 'list':
        ctx.reply('Available filters:\n```\n3D\nbassboost\necho\nkaraoke\nnightcore\nvaporwave\nflanger\ngate\nhaas\nreverse\nsurround\nmcompand\nphaser\ntremolo\nearwax```')
        break
      case '3d':
        this.client.distube.setFilter(ctx.message, '3d')
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'bassboost':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'echo':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'karaoke':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'nightcore':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'vaporwave':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'flanger':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'gate':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'haas':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'reverse':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'surround':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'mcompand':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'phaser':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'tremolo':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      case 'earwax':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply(`Enabled \`${args[0].toLowerCase()}\` filter.`)
        break
      default:
        ctx.reply(`Invalid filter! Use \`${ctx.guild ? ctx.guild.settings.prefix : '|'}filter list\` to get a list of available filters.`)
        break
    }
  }
}

module.exports = Filter
