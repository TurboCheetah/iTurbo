const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class KSoftImageCommand extends Command {
  constructor({ command, ...options }, ...args) {
    super(...args, {
      description: language => language.get(`${command}Description`),
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS'],
      ...options
    })
    this.command = command
  }

  async run(ctx, [member]) {
    if (this.guildOnly && !member) return ctx.reply(ctx.language.get(`${this.command}NoMention`))

    if (this.command === 'hentai') this.command = this.client.utils.random(['hentai', 'hentai_gif'])
    const { url } = await this.client.ksoft.images.random(this.command, { nsfw: ctx.channel.nsfw })

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setImage(url)
      .setFooter(ctx.language.get('poweredByKSoft'), ctx.author.displayAvatarURL({ size: 128, dynamic: true }))

    if (member) {
      member = await this.verifyMember(ctx, member)
      if (member.id === ctx.author.id) return ctx.reply(ctx.language.get(`${this.command}Self`))
      embed.setDescription(ctx.language.get(`${this.command}Response`, ctx.member, member))
    }

    return ctx.reply({ embed })
  }
}

module.exports = KSoftImageCommand
