const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Bug extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('bugDescription'),
      usage: language => language.get('bugUsage'),
      cooldown: 60,
      aliases: ['reportbug', 'bugreport'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription(ctx.language.get('bugPrompt'))
        .setTimestamp()

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply(ctx.language.get('noReplyTimeout', 60))

      if (response) {
        await this.client.shard.broadcastEval(`
        const channel = this.channels.cache.get('735638645486125167')
        if (channel) {
          const { MessageEmbed } = require('discord.js')
    
          const embed = new MessageEmbed()
          .setTitle('${ctx.language.get('bugTitile')}')
          .setDescription('${args.join(' ')}')
          .setColor(this.client.constants.color)
          .setAuthor('${ctx.author.tag}', '${ctx.author.displayAvatarURL({ size: 128, dynamic: true })}')
          .setFooter('${ctx.author.id}')
    
        channel.send({ embed })
        }
        `)

        return ctx.reply(ctx.language.get('bugSuccess', ctx))
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply(ctx.language.get('operationCancelled'))
      }
    }
    await this.client.shard.broadcastEval(`
    const channel = this.channels.cache.get('735638645486125167')
    if (channel) {
      const { MessageEmbed } = require('discord.js')

      const embed = new MessageEmbed()
      .setTitle('${ctx.language.get('bugTitile')}')
      .setDescription('${args.join(' ')}')
      .setColor(this.client.constants.color)
      .setAuthor('${ctx.author.tag}', '${ctx.author.displayAvatarURL({ size: 128, dynamic: true })}')
      .setFooter('${ctx.author.id}')

    channel.send({ embed })
    }
    `)

    return ctx.reply(ctx.language.get('bugSuccess', ctx))
  }
}

module.exports = Bug
