const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Simp extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Based on my simp-scale I will determine the amount of simp you have in you',
      usage: 'simp [@user]'
    })
  }

  async run (ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| ${member.user.username} is ${Math.floor(Math.random() * (100 - 1) + 1)}% simp!`, member.user.displayAvatarURL({ size: 512 }))
    return ctx.reply({ embed })
  }
}

module.exports = Simp
