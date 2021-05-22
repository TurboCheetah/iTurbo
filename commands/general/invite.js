const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Invite extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('inviteDescription'),
      aliases: ['inv'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    return ctx.reply(
      new MessageEmbed()
        .setColor(this.client.colors.constant)
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 128, dynamic: true }))
        .setDescription(`**[${ctx.language.get('inviteLink')}](https://discordapp.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot)** • **[${ctx.language.get('inviteSupport')}](https://discord.gg/011UYuval0uSxjmuQ)**`)
    )
  }
}

module.exports = Invite
