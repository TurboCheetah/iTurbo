import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { join } from 'path'
import { ShardingManager } from 'discord.js'
import { Logger } from '#utils/Logger'

dotenv.config({ path: join(__dirname, '/../.env') })

const manager = new ShardingManager(join(__dirname, `bot.js`), {
    totalShards: 'auto',
    respawn: true,
    token: process.env.TOKEN,
    mode: 'process'
})

manager
    .on('shardCreate', shard => {
        Logger.success(`[ShardingManager] Shard #${shard.id} spawned`)

        shard.on('disconnect', () => {
            Logger.warn(`[ShardingManager] Shard #${shard.id} disconnected`)
        })

        if (manager.shards.size === manager.totalShards) Logger.success('[ShardingManager] All shards spawned successfully')
    })
    .spawn()
    .catch(err => Logger.error(`[ShardingManager] ${(err as Error).message}`))
