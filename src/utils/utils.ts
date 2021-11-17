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

export const formatNumber = (number: number | string): string => {
  return (+number).toLocaleString()
}

export const isNSFW = (channel: TextBasedChannels): boolean => {
  if (channel.type === 'GUILD_TEXT' && channel.nsfw) return true
  return false
}

export const resolveEmoji = (emoji: string): { id: string; animated: string; name: string } | null => {
  const emojiRegex = /^(?:<(?<animated>a)?:(?<name>\w{2,32}):)?(?<id>\d{17,21})>?$/
  const match = emojiRegex.exec(emoji)
  return match?.groups ? { animated: match.groups.animated, name: match.groups.name, id: match.groups.id } : null
}
