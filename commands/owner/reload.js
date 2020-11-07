const Command = require('../../structures/Command.js')

class Reload extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Reloads a command.',
      usage: '!reload <piece>',
      ownerOnly: true,
      hidden: true,
      aliases: ['r']
    })
  }

  async run (ctx, [pieceName]) {
    if (!pieceName) return ctx.reply(this.client.utils.random(this.client.responses.reloadMissingArg))
    const piece = this.client.commands.get(pieceName) || this.client.events.get(pieceName) || this.client.events.raw.get(pieceName)
    if (!piece) return ctx.reply(this.client.utils.random(this.client.responses.reloadNotFound).replace(/{{user}}/g, ctx.guild ? ctx.member.displayName : ctx.author.username).replace(/{{command}}/g, pieceName))

    try {
      const reloaded = await piece.reload()
      return ctx.reply(this.client.utils.random(this.client.responses.reloadSuccess)
        .replace(/{{command}}/g, reloaded.name))
    } catch (err) {
      piece.store.set(piece)
      return ctx.reply(this.client.utils.random(this.client.responses.reloadErrUnload)
        .replace(/{{command}}/g, piece.name)
        .replace(/{{user}}/g, ctx.guild ? ctx.member.displayName : ctx.author.username)
        .replace(/{{response}}/g, err.message || err.toString()))
    }
  }
}

module.exports = Reload
