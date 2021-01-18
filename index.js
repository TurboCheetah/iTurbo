const { ShardingManager } = require('discord.js')
const { devtoken, token } = require('./config.json')

const manager = new ShardingManager('./bot.js', {
  token: process.argv.includes('--dev') || process.env.NODE_ENV === 'dev' ? devtoken : token,
  totalShards: 'auto',
  shardArgs: process.argv.includes('--dev') || process.env.NODE_ENV === 'dev' ? ['--dev'] : []
})

manager.on('shardCreate', shard => {
  shard.on('ready', () => {
    console.log(`Shard #${shard.id} is online`)

    if (shard.id + 1 === shard.manager.totalShards) return shard.send({ type: 'shard', data: { lastShardReady: true } })
  })
})

manager.spawn(undefined, undefined, -1)
