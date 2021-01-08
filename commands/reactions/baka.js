const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Baka extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Baka baka baka!',
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)

    const { url } = await c('https://nekos.life/api/v2/img/baka').json()

    const embed = new MessageEmbed()
      .setTitle('Baka')
      .setColor(0x9590ee)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }))

    if (member.id !== ctx.author.id) embed.setDescription(`**${member.displayName}**, you baka!`)
    return ctx.reply({ embed })
  }
}

module.exports = Baka
