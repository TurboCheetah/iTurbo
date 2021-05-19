const Command = require('#structures/Command')

class Update extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Execs git pull to update bot.',
      ownerOnly: true,
      hidden: true,
      usage: 'update --reload=commands --reboot'
    })
  }

  async run(ctx) {
    // await this.store.get('exec').run(ctx, ['git pull'])

    if (ctx.flags.reload) {
      if (ctx.flags.reload === 'commands' || ctx.flags.reload === 'events') {
        await this.client.shard.broadcastEval(`
        (async () => {
          await this.commands.get('load').run(${ctx}, '${[ctx.flags.reload]}')
        })()
        `)
      } else {
        await this.client.shard.broadcastEval(`
        (async () => {
          await this.commands.get('reload').run(${ctx}, '${[ctx.flags.reload]}')
        })()
        `)
      }
    }

    if (ctx.flags.reboot) {
      await this.client.shard.broadcastEval(`
      (async () => {
        await this.commands.get('reboot').run(${ctx})
      })()
      `)
    }
  }
}

module.exports = Update
