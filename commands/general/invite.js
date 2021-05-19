const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Invite extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Invite me to your server!',
      aliases: ['inv'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    // eslint-disable-line no-unused-vars
    return ctx.reply(
      new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription('**[Invite Link](https://discordapp.com/oauth2/authorize?client_id=175249503421464576&permissions=2016537702&scope=bot)** • **[Support Server](https://discord.gg/011UYuval0uSxjmuQ)**')
    )
  }
}

module.exports = Invite
