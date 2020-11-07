const Command = require('../../structures/Command.js')

class Mimic extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Copy someone and talk as them.',
      aliases: ['copycat'],
      botPermissions: ['MANAGE_WEBHOOKS'],
      usage: 'mimic <@user> <msg...>',
      guildOnly: true,
      cost: 20,
      cooldown: 100
    })
  }

  async run (ctx, [user, ...message]) {
    user = await this.verifyUser(ctx, user)
    if (ctx.message.deletable) await ctx.message.delete()
    const avatar = user.displayAvatarURL({ format: 'png', size: 2048 })
    const webhook = await ctx.channel.createWebhook(user.username, { avatar })
    await webhook.send(message.join(' ').replace(/@(everyone|here)/g, '@\u200b$1'))
    await webhook.delete()
  }
}

module.exports = Mimic
