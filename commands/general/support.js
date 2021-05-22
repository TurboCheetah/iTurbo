const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Support extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('supportDescription'),
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    return ctx.reply(
      new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(ctx.language.get('supportTitle'))
        .setDescription(ctx.language.get('supportDesc'))
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 128, dynamic: true }))
    )
  }
}

module.exports = Support
