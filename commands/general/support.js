const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Support extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Get the link to our support server.',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx) { // eslint-disable-line no-unused-vars
    return ctx.reply(new MessageEmbed()
      .setTitle("Join Turbo's Hub")
      .setColor(0x9590EE)
      .setDescription("If you need help with setting me up on your server or just want to hangout, join Turbo's Hub.\nYou also get an oppurtunity to become a Premium user which can only be obtained through a role in our server.\nYou will also recieve updates about the bot and much more!\n\n[Join Turbo's Hub](https://discord.gg/011UYuval0uSxjmuQ)")
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 })))
  }
}

module.exports = Support
