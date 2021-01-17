const Command = require('../../structures/Command.js')

class Seek extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Seeks to a desired time in the song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'seek <time in seconds>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, args) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.errorImg)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    if (isNaN(args[0])) {
      return ctx.msgEmbed('Please supply a valid number!', this.client.constants.errorImg)
    }

    player.seek(player.position + Number(args[0]) * 1000)
    return ctx.msgEmbed(`Moved ${args[0]} seconds ${args[0] > 0 ? 'ahead' : 'behind'}!`, this.client.constants.successImg)
  }
}

module.exports = Seek
