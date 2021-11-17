import { TextBasedChannels } from 'discord.js'

export const toProperCase = (str: string): string => {
  return str.replace(/([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export const random = (arr: any[]): any => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const shorten = (text: string, maxLen = 1024): string => {
  return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text
}

export const isNSFW = (channel: TextBasedChannels): boolean => {
  if (channel.type === 'GUILD_TEXT' && channel.nsfw) return true
  return false
}
