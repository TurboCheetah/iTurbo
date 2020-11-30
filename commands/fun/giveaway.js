const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const ms = require('ms')

class Giveaway extends Command {
  constructor (...args) {
    super(...args, {
      cooldown: 3,
      description: 'Create, end, and reroll giveaways',
      usage: 'giveaway <start|end|reroll|delete>',
      start: {
        usage: 'giveaway start <channel> <duration> <winnerCount> <prize>'
      },
      end: {
        usage: 'giveaway end <messageID>'
      },
      reroll: {
        usage: 'giveaway reroll <messageID>'
      },
      delete: {
        usage: 'giveaway delete <messageID>'
      },
      userPermissions: ['MANAGE_GUILD'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, [action, ...args]) {
    if (!['start', 'end', 'reroll', 'delete'].includes(action)) {
      return ctx.reply(`${this.client.constants.error} Correct usage: \`${ctx.guild.prefix}${this.usage}\``)
    }

    return this[action](ctx, args)
  }

  async start (ctx, args) {
    const giveawayChannel = ctx.message.mentions.channels.first()

    if (!giveawayChannel) {
      return ctx.reply(`${this.client.constants.error} No channel specified. Please mention a valid channel.\nCorrect usage: \`${ctx.guild.prefix}${this.start.usage}\``)
    }

    const duration = args[1]

    if (!duration || isNaN(ms(duration))) {
      return ctx.reply(`${this.client.constants.error} Invalid duraiton specified. Please specify a valid duration, e.g 24h.\nCorrect usage: \`${ctx.guild.prefix}${this.start.usage}\``)
    }

    const winners = args[2]

    if (!winners || isNaN(winners) || (parseInt(winners) <= 0)) {
      return ctx.reply(`${this.client.constants.error} Invalid winner count. Please specify a valid amount of giveaway winners.\nCorrect usage: \`${ctx.guild.prefix}${this.start.usage}\``)
    }

    const prize = args[3]

    if (!prize) {
      return ctx.reply(`${this.client.constants.error} No prize specified! Please specify a valid prize.\nCorrect usage: \`${ctx.guild.prefix}${this.start.usage}\``)
    }

    ctx.reply(`🎉 Started giveaway in ${giveawayChannel}! 🎉`)

    this.client.giveawaysManager.start(giveawayChannel, {
      time: ms(duration),
      prize: prize,
      winnerCount: winners,
      hostedBy: ctx.author,
      messages: {
        giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
        giveawayEnded: '🎉🎉 **GIVEAWAY ENDED** 🎉🎉',
        timeRemaining: 'Time remaining: **{duration}**!',
        inviteToParticipate: 'React with 🎉 to participate!',
        winMessage: 'Congratulations, {winners}! You won **{prize}**!',
        embedFooter: 'Giveaways',
        noWinner: 'Giveaway ended with no valid participations.',
        hostedBy: 'Hosted by: {user}',
        winners: 'winner(s)',
        endedAt: 'Ended at',
        units: {
          seconds: 'seconds',
          minutes: 'minutes',
          hours: 'hours',
          days: 'days',
          pluralS: false
        }
      }
    })
  }

  async end (ctx, args) {
    if (!args[0]) {
      return ctx.reply(`${this.client.constants.error} You need to specify a valid message ID!\nCorrect usage: \`${ctx.guild.prefix}${this.end.usage}\``)
    }

    const giveaway = this.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || this.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0])

    if (!giveaway) {
      return ctx.reply(`${this.client.constants.error} Unable to find a giveaway with ID \`${args[0]}\``)
    }

    this.client.giveawaysManager.edit(giveaway.messageID, {
      setEndTimestamp: Date.now()
    }).then(() => {
      ctx.reply(`Giveaway will end in less than ${(this.client.giveawaysManager.options.updateCountdownEvery / 1000)} seconds!`)
    }).catch((e) => {
      if (typeof e === 'string' && e.startsWith(`Giveaway with message ID ${giveaway.messageID} has already ended.`)) {
        ctx.reply('This giveaway has already ended!')
      } else {
        this.client.emit('commandError', ctx, e)
      }
    })
  }

  async reroll (ctx, args) {
    if (!args[0]) {
      return ctx.reply(`${this.client.constants.error} You need to specify a valid message ID!\nCorrect usage: \`${ctx.guild.prefix}${this.reroll.usage}\``)
    }

    const giveaway = this.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || this.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0])

    if (!giveaway) {
      return ctx.reply(`${this.client.constants.error} Unable to find a giveaway with ID \`${args[0]}\``)
    }

    this.client.giveawaysManager.reroll(giveaway.messageID).then(() => {
      ctx.reply('Giveaway rerolled!')
    }).catch((e) => {
      if (typeof e === 'string' && e.startsWith(`Giveaway with message ID ${giveaway.messageID} has not ended.`)) {
        ctx.reply('This giveaway has not ended!')
      } else {
        this.client.emit('commandError', ctx, e)
      }
    })
  }

  async delete (ctx, args) {
    if (!args[0]) {
      return ctx.reply(`${this.client.constants.error} You need to specify a valid message ID!\nCorrect usage: \`${ctx.guild.prefix}${this.delete.usage}\``)
    }

    const giveaway = this.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || this.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0])

    if (!giveaway) {
      return ctx.reply(`${this.client.constants.error} Unable to find a giveaway with ID \`${args[0]}\``)
    }

    this.client.giveawaysManager.delete(giveaway.messageID).then(() => {
      ctx.reply('Giveaway deleted!')
    }).catch((e) => {
      this.client.emit('commandError', ctx, e)
    })
  }
}

module.exports = Giveaway
