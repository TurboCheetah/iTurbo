const Command = require('#structures/Command')

class Prune extends Command {
  constructor(...args) {
    super(...args, {
      userPermissions: ['MANAGE_MESSAGES'],
      botPermissions: ['MANAGE_MESSAGES'],
      guildOnly: true,
      description: 'Prunes a certain amount of messages w/o filter.',
      aliases: ['purge', 'clean'],
      usage: 'prune [limit=50] [link|invite|bots|you|me|upload|@user]',
      arguments: {
        limit: 'How many messages to delete',
        filter: 'What type of messages to delete'
      },
      examples: {
        50: 'Deletes the last 50 messages',
        '50 bots': 'Deletes the last 50 messages sent by bots'
      }
    })
  }

  async run(ctx, [limit, filter = null]) {
    limit = this.verifyInt(limit, 50)
    if (limit > 100) {
      return ctx.reply('I can only clean up to 100 messages at a time!')
    }

    try {
      let messages = await ctx.channel.messages.fetch({ limit: 100 })

      if (filter) {
        const user = await this.verifyUser(ctx, filter).catch(() => null)
        const type = user ? 'user' : filter
        messages = messages.filter(this.getFilter(ctx, type, user))
      }

      let toDelete = limit
      if (messages.has(ctx.message.id)) limit++
      messages = messages.keyArray().slice(0, limit)
      if (!messages.includes(ctx.message.id)) messages.push(ctx.message.id)
      await ctx.channel.bulkDelete(messages)
      if (toDelete > 100) toDelete = toDelete - 1
      return ctx.reply(`${this.client.constants.emojis.success} Successfully deleted ${messages.length > toDelete ? messages.length - 1 : messages.length} messages out of ${toDelete}.`).then(ctx => {
        ctx.delete({ timeout: 2500 })
      })
    } catch (err) {
      return ctx.reply(`${this.client.constants.emojis.error} ${err.message}`)
    }
  }

  getFilter(ctx, filter, user) {
    switch (filter) {
      case 'link':
        return msg => /https?:\/\/[^ /.]+\.[^ /.]+/.test(msg.content)
      case 'invite':
        return msg => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(msg.content)
      case 'bots':
        return msg => msg.author.bot
      case 'you':
        return msg => msg.author.id === this.client.user.id
      case 'me':
        return msg => msg.author.id
      case 'upload':
        return msg => msg.attachments.size > 0
      case 'user':
        return msg => msg.author.id === user.id
      default:
        return () => true
    }
  }
}

module.exports = Prune
