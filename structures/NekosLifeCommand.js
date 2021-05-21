const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class NekosLifeCommand extends Command {
  constructor(command, ...args) {
    super(...args, {
      description: language => language.get(`COMMAND_${command.toUpperCase()}_DESCRIPTION`),
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
    this.command = command
  }

  async run(ctx, [member]) {
    if (this.guildOnly && !member) return ctx.reply(ctx.language.get(`COMMAND_${this.command.toUpperCase()}_NOMENTION`))

    const { url } = await c(`https://nekos.life/api/v2/img/${this.command !== 'aavatar' ? this.command : `${ctx.channel.nsfw ? 'nsfw_' : ''}avatar`}`).json()

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setImage(url)
      .setFooter('Powered by nekos.life')

    if (member) {
      member = await this.verifyMember(ctx, member)
      if (member.id === ctx.author.id) return ctx.reply(ctx.language.get(`COMMAND_${this.command.toUpperCase()}_SELF`))
      embed.setDescription(ctx.language.get(`COMMAND_${this.command.toUpperCase()}_RESPONSE`, ctx.member, member))
    }

    return ctx.reply({ embed })
  }
}

module.exports = NekosLifeCommand
