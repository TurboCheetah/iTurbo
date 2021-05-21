const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class NekosLifeCommand extends Command {
  constructor({ name, ...options }, ...args) {
    super(...args, {
      description: language => language.get(`${name}Description`),
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS'],
      ...options
    })
  }

  async run(ctx, [member]) {
    if (this.guildOnly && !member) return ctx.reply(ctx.language.get(`${this.name}NoMention`))

    const { url } = await c(`https://nekos.life/api/v2/img/${this.name !== 'aavatar' ? this.name : `${ctx.channel.nsfw ? 'nsfw_' : ''}avatar`}`).json()

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setImage(url)
      .setFooter(ctx.language.get('poweredByNekosLife'))

    if (member) {
      member = await this.verifyMember(ctx, member)
      if (member.id === ctx.author.id) return ctx.reply(ctx.language.get(`${this.name}Self`))
      embed.setDescription(ctx.language.get(`${this.name}Response`, ctx.member, member))
    }

    return ctx.reply({ embed })
  }
}

module.exports = NekosLifeCommand
