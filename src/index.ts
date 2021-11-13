import * as dotenv from 'dotenv'
import { join } from 'path'
import { ShardingManager } from 'kurasuta'
import { IslaClient } from './Client'
import { Client } from 'discord.js'

dotenv.config({ path: join(__dirname, '/../.env') })
process.env.NODE_ENV ??= 'development'
process.on('unhandledRejection', (err: Error) => console.error(err))

const manager = new ShardingManager(join(__dirname, 'Manager'), {
  development: process.env.NODE_ENV === 'development',
  client: Bot as typeof Client,
  token: process.env.NODE_ENV === 'development' ? process.env.DEV_TOKEN : process.env.TOKEN
})

manager.spawn()
