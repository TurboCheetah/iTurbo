const Event = require('#structures/Event')

class Raw extends Event {
  run(packet, shard) {
    this.client.manager.updateVoiceState(packet)

    const event = this.store.raw.get(packet.t)
    if (!event) return

    return event._run(packet.d, shard)
  }
}

module.exports = Raw
