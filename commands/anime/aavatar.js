const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class AAvatar extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get an Anime Avatar.',
      extendedHelp: 'The output will be NSFW only if the channel is a NSFW channel',
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await c(`https://nekos.life/api/v2/img/${ctx.channel.nsfw ? 'nsfw_' : ''}avatar`).json()

    const embed = new MessageEmbed()
      .setTitle(`${ctx.channel.nsfw ? 'NSFW ' : ''}Anime Avatar`)
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter('Powered by nekos.life', ctx.author.displayAvatarURL({ size: 32, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = AAvatar
