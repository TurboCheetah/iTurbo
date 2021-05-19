const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class UserInfo extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get information on a mentioned user.',
      usage: 'userinfo [@user]',
      guildOnly: true,
      aliases: ['ui', 'user'],
      botPermissions: ['EMBED_LINKS']
    })

    this.statuses = {
      online: '<:online:473263910045351957> Online',
      idle: '<:idle:473264190346493964> Idle',
      dnd: '<:dnd:473264076852559873> Do Not Disturb',
      offline: 'Offline'
    }
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true)
    const days = Math.floor((new Date() - member.user.createdAt) / (1000 * 60 * 60 * 24))
    const joinedDays = Math.floor((new Date() - member.joinedAt) / (1000 * 60 * 60 * 24))

    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} ${member.nickname ? `(${member.nickname})` : ''}`, member.user.displayAvatarURL({ size: 128, dynamic: true }))
      .setColor(member.displayHexColor || 0x9590ee)
      .setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true }))
      .addField('❯ Discord Join Date', `${member.user.createdAt.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} (${days} days ago!)`)
      .addField('❯ Server Join Date', `${member.joinedAt.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} (${joinedDays} days ago!)`)
      .addField('❯ Status', this.statuses[member.presence.status])
      .addField('❯ Highest Role', member.roles.cache.size > 1 ? member.roles.highest : 'None', true)
      .addField('❯ Hoist Role', member.roles.hoist ? member.roles.hoist : 'None', true)
      .setFooter(`ID: ${member.user.id}`)

    // eslint-disable-next-line prettier/prettier
    if (member.roles.cache.size > 1) embed.addField(`❯ Roles (${member.roles.cache.size - 1})`, member.roles.cache.filter(r => r.name !== '@everyone').map(r => r).join(', '), false)
    if (member.user.bot) embed.setFooter(`ID: ${member.user.id}`, 'https://cdn.turbo.ooo/iturbo/bot.png')
    return ctx.reply({ embed })
  }
}

module.exports = UserInfo
