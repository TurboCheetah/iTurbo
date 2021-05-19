const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class NPMPkgSize extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Shows the install/publish size of a npm package.',
      usage: 'npmpkgsize express',
      aliases: ['pkgsize', 'npmsize'],
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [name]) {
    if (!name) return ctx.reply('What package am I supposed to show you?')

    try {
      const { publishSize, installSize } = await c(`https://packagephobia.now.sh/api.json?p=${encodeURIComponent(name)}`).json()

      if (!publishSize && !installSize) return ctx.reply("That package doesn't exist.")

      const embed = new MessageEmbed()
        .setTitle(`NPM Package Size - ${name}`)
        .setColor(0x9590ee)
        .setDescription(`**Publish Size:** ${this.client.utils.getBytes(publishSize)}\n**Install Size:** ${this.client.utils.getBytes(installSize)}`)
        .setFooter('Powered by packagephobia.now.sh')
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))

      return ctx.reply({ embed })
    } catch (err) {
      throw "That package doesn't exist."
    }
  }
}

module.exports = NPMPkgSize
