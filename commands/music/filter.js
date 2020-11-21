const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Filter extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Enable or disable a filter. Run the command again to disable a filter.',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'filter <filter>',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run (ctx, args) {
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| Enabled ${args[0].toLowerCase()} filter`, ctx.author.displayAvatarURL({ size: 512 }))

    switch (args[0].toLowerCase()) {
      case 'list':
        ctx.reply('Available filters:\n```\n3D\nbassboost\necho\nkaraoke\nnightcore\nvaporwave\nflanger\ngate\nhaas\nreverse\nsurround\nmcompand\nphaser\ntremolo\nearwax```')
        break
      case '3d':
        this.client.distube.setFilter(ctx.message, '3d')
        ctx.reply({ embed })
        break
      case 'bassboost':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'echo':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'karaoke':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'nightcore':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'vaporwave':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'flanger':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'gate':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'haas':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'reverse':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'surround':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'mcompand':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'phaser':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'tremolo':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      case 'earwax':
        this.client.distube.setFilter(ctx.message, args[0].toLowerCase())
        ctx.reply({ embed })
        break
      default:
        ctx.reply(`Invalid filter! Use \`${ctx.guild ? ctx.guild.settings.prefix : '|'}filter list\` to get a list of available filters.`)
        break
    }
  }
}

module.exports = Filter
