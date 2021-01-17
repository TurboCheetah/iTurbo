const Command = require('../../structures/Command.js')

class Volume extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Adjusts the volume',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'volume [percent]',
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
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    if (!args[0]) {
      return ctx.msgEmbed(`The current playback volume is at ${player.volume}%`)
    }

    if (isNaN(args[0])) {
      return ctx.msgEmbed('Invalid number! Please choose a percent from 0-100%', this.client.constants.errorImg)
    }

    player.setVolume(Number(args[0]))
    return ctx.msgEmbed(`Set volume to ${args[0]}%`, this.client.constants.successImg)
  }
}

module.exports = Volume
