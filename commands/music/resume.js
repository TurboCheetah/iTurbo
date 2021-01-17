const Command = require('../../structures/Command.js')

class Resume extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Resumes the queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'resume',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.emojis.errorImg)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      ctx.msgEmbed('Nothing is playing!', this.client.constants.emojis.errorImg)
    }

    if (!player.paused) {
      return ctx.msgEmbed('The queue has not been paused!', this.client.constants.emojis.errorImg)
    }

    player.pause(false)
    return ctx.msgEmbed('▶ Resumed the player')
  }
}

module.exports = Resume
