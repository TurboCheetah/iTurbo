const Command = require('#structures/Command')

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
    this.client.utils.isDJ(ctx)

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
