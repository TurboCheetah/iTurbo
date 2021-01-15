const Command = require('../../structures/Command.js')

class ClearQueue extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Clears the queue',
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'clearqueue',
      aliases: ['clearq', 'cq'],
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

    const channel = ctx.member.voice.channel
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.msgEmbed('You need to be in the same voice channel as me!', this.client.constants.errorImg)

    if (!player.queue.length) return ctx.msgEmbed('There is nothing to clear!', this.client.constants.errorImg)

    player.queue = []
    ctx.msgEmbed('Cleared the queue')
  }
}

module.exports = ClearQueue
