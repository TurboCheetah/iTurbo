const Command = require('#structures/Command')

class Reload extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Reloads a command.',
      usage: 'reload <piece>',
      ownerOnly: true,
      hidden: true,
      aliases: ['r']
    })
  }

  async run(ctx, [pieceName]) {
    if (!pieceName) return ctx.reply(this.client.utils.random(this.client.responses.reloadMissingArg))
    const piece = this.client.commands.get(pieceName) || this.client.events.get(pieceName) || this.client.events.raw.get(pieceName)
    if (!piece) {
      return ctx.reply(
        this.client.utils
          .random(this.client.responses.reloadNotFound)
          .replace(/{{user}}/g, ctx.guild ? ctx.member.displayName : ctx.author.username)
          .replace(/{{command}}/g, pieceName)
      )
    }

    const reload = await this.client.shard.broadcastEval(`
      (async () => {
        const piece = this.commands.get('${piece.name}') || this.events.get('${piece.name}')
      
        try {
          await piece.reload()
          return {
            status: 'success'
          }
        } catch (err) {
          piece.store.set(piece)
          return {
            status: 'failure',
            error: err.message || err.toString()
          }
        }
      })()
      `)

    if (reload.filter(res => res.status === 'failure').length > 0) {
      return ctx.reply(
        this.client.utils
          .random(this.client.responses.reloadErrUnload)
          .replace(/{{command}}/g, piece.name)
          .replace(/{{user}}/g, ctx.guild ? ctx.member.displayName : ctx.author.username)
          .replace(/{{response}}/g, reload.filter(res => res.error)[0].error)
      )
    }

    return ctx.reply(this.client.utils.random(this.client.responses.reloadSuccess).replace(/{{command}}/g, piece.name))
  }
}

module.exports = Reload
