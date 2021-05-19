const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Hug extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Hug someone',
      usage: 'hug <@member>',
      guildOnly: true,
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply("You can't hug yourself!")

    const { url } = await this.client.ksoft.images.random('hug', { nsfw: ctx.channel.nsfw })

    const embed = new MessageEmbed().setColor(0x9590ee).setDescription(`**${member.displayName}**, you just got hugged by **${ctx.member.displayName}**`).setImage(url).setFooter('Powered by KSoft.Si')

    return ctx.reply({ embed })
  }
}

module.exports = Hug
