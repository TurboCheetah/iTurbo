import * as dotenv from 'dotenv'
import path from 'path'
import { Bot } from './Client'

dotenv.config({ path: path.join(__dirname, '/../.env') })
process.env.NODE_ENV ??= 'development'

const bot = new Bot()
bot.init()

export const client = bot
