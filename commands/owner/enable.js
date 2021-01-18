const Command = require('../../structures/Command.js')

class Enable extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enables a command or event.',
      ownerOnly: true,
      hidden: true,
      usage: '!enable <command|event>'
    })
  }

  async run(ctx, [piece]) {
    if (!piece) return ctx.reply('What am I supposed to enable?')
    piece = this.store.get(piece) || this.client.events.get(piece)
    if (!piece) return ctx.reply('That piece does not exist!')
    if (piece.enabled) return ctx.reply(`**${piece.name}** is already enabled.`)
    this.client.shard.broadcastEval(`
    const piece = this.commands.get('${piece.name}') || this.events.get('${piece.name}')
    piece.enable()
    `)
    return ctx.reply(`${this.client.constants.emojis.success} Successfully enabled the ${piece.store.name.slice(0, -1)} ${piece.name}`)
  }
}

module.exports = Enable
