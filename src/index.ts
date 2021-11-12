import * as dotenv from 'dotenv'
import { join } from 'path'
import { ShardingManager } from 'kurasuta'
import { Bot } from './Client'
import { Client } from 'discord.js'

dotenv.config({ path: join(__dirname, '/../.env') })
process.env.NODE_ENV ??= 'development'
process.on('unhandledRejection', (err: Error) => console.error(err))

const manager = new ShardingManager(join(__dirname, 'Manager'), {
  development: process.env.NODE_ENV === 'development',
  client: Bot as typeof Client,
  token: process.env.TOKEN,
  clusterCount: 1
})

manager.spawn()
