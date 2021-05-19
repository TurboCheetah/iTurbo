const Event = require('#structures/Event')

class voiceStateUpdate extends Event {
  async run(oldState, newState) {
    const player = this.client.manager.players.get(newState.guild.id)
    if (!player) return

    if (this.client.guilds.cache.get(player.options.guild).channels.cache.get(player.options.voiceChannel).members.size === 1) {
      player.pause(true)
    }

    if (this.client.guilds.cache.get(player.options.guild).channels.cache.get(player.options.voiceChannel).members.size === 2) {
      if (player.paused) {
        player.pause(false)
      }
    }

    /*     if (oldState.channel) {
      const entry = await oldState.channel.guild.fetchAuditLogs({
        type: 'MEMBER_DISCONNECT'
      }).then(audit => audit.entries.first())
      if (entry.id != this.user.id) return
      oldState.channel.join()
    } */
  }
}

module.exports = voiceStateUpdate
