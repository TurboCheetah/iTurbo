const Command = require('#structures/Command')
const { MessageAttachment } = require('discord.js')

class Dominant extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/images/dominant:description'),
      aliases: ['dominantcolor', 'avatarcolor', 'avcolor'],
      cooldown: 3,
      cost: 5,
      usage: language => language('commands/images/dominant:usage')

    })
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true)

    const { hex, rgb } = await this.client.img.dominantColor(user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' }))
    const img = await this.client.img.color(hex)

    return ctx.reply(`**Hex:** ${hex}\n**RGB:** rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, new MessageAttachment(img, 'dominant.png'))
  }
}

module.exports = Dominant
