import * as dotenv from 'dotenv'
import path from 'path'
import { Bot } from './Client'
import { Logger } from './utils/Logger'

dotenv.config({ path: path.join(__dirname, '/../.env') })
process.env.NODE_ENV ??= 'development'
process.on('unhandledRejection', (err: Error) => Logger.error(err))

const bot = new Bot()
bot.init()

export const client = bot
