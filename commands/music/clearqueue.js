const Command = require('../../structures/Command.js')

class ClearQueue extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Clears the queue',
      aliases: ['clearq'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'clearqueue',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.errorImg)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    ctx.msgEmbed('Successfully cleared the queue')
    player.queue.clear()
  }
}

module.exports = ClearQueue
