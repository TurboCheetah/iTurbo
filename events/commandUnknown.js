const Event = require('../structures/Event.js')
const levenshtein = require('fast-levenshtein')

class CommandUnknown extends Event {
  async run(msg, command) {
    // When a non-existent command was ran try to use the levenshtein algorithm to find a close match.
    const distances = []
    const usableCommands = this.client.commands.usableCommands(msg)

    for (const cmd of usableCommands) {
      distances.push({
        dist: levenshtein.get(cmd.name, command),
        cmd
      })
    }

    if (!distances.length) return

    distances.sort((a, b) => a.dist - b.dist)

    const prefix = msg.guild ? msg.guild.settings.prefix : '|'

    if (distances[0].dist > 0 && distances[0].dist <= 2) {
      return msg.channel.send(`|\`❔\`| Did you mean \`${prefix + distances[0].cmd.name}\`?`).catch(() => null)
    }
  }
}

module.exports = CommandUnknown
