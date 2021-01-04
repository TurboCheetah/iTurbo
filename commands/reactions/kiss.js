const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Kiss extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Kiss someone',
      usage: 'kiss <@member>',
      guildOnly: true,
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply("You can't kiss yourself!")

    const { url } = await this.client.ksoft.images.random('kiss', { nsfw: ctx.channel.nsfw })

    const embed = new MessageEmbed()
      .setTitle('Kiss')
      .setColor(0x9590ee)
      .setDescription(`**${member.displayName}**, you just got a kiss from **${ctx.member.displayName}**`)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by KSoft.si`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed })
  }
}

module.exports = Kiss
