/* eslint-disable camelcase */
export interface Hentai {
  id: number | string
  name: string
  titles: string[]
  slug: string
  description: string
  views: number
  interests: number
  posterURL: string
  coverURL: string
  brand: string
  brandID: string
  durationInMs: number
  isCensored: boolean
  rating: string
  likes: number
  dislikes: number
  downloads: number
  monthlyRank: number
  tags:
    | Array<{
        id: number
        text: string
      }>
    | string[]
  releasedAt: Date
  url: string
  streamURL: string
  malURL: string
  malID: number
  updatedAt: Date
  invalid?: boolean
}
