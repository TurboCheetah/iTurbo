const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Avatar extends Command {
  constructor(...args) {
    super(...args, {
      description: "Grab someone's avatar.",
      aliases: ['av', 'pfp'],
      usage: 'avatar [@user]',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [userArg]) {
    const user = await this.verifyUser(ctx, userArg, true)

    return ctx.reply(
      new MessageEmbed()
        .setTitle(user.tag)
        .setColor(0x9590ee)
        .setImage(user.displayAvatarURL({ size: 2048, dynamic: true, format: 'png' }))
    )
  }
}

module.exports = Avatar
