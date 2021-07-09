const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Support extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/general/support:description'),
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    return ctx.reply(
      new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(ctx.translate('commands/general/support:title'))
        .setDescription(ctx.translate('commands/general/support:desc'))
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 128, dynamic: true }))
    )
  }
}

module.exports = Support
