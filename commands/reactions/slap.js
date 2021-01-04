const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class Slap extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Slap someone',
      usage: 'slap <@member>',
      guildOnly: true,
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply("You can't slap yourself!")

    const { url } = await fetch('https://nekos.life/api/v2/img/slap').then(res => res.json())

    const embed = new MessageEmbed()
      .setTitle('Slap')
      .setColor(0x9590ee)
      .setDescription(`**${member.displayName}**, you just got slapped by **${ctx.member.displayName}**`)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = Slap
