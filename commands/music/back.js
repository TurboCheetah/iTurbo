/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command.js')
const { TrackUtils } = require('erela.js')

class Back extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Skips back to the previous song',
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'back',
      aliases: ['previous'],
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, args) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    const channel = ctx.member.voice.channel
    let player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      // Create the player
      player = this.client.manager.create({
        guild: ctx.guild.id,
        voiceChannel: ctx.member.voice.channel.id,
        textChannel: ctx.channel.id,
        selfDeafen: true
      })
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.reply(`${this.client.constants.error} You need to be in the same voice channel as me!`)

    const tData = await this.client.manager.decodeTrack(player.queue.previous.track)
    const track = TrackUtils.build(tData, ctx.author)
    player.queue.add(track, 0)
    player.stop()
    const m = await ctx.success()
    m.message.delete({ timeout: 5000 })
  }
}

module.exports = Back
