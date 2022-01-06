/* eslint-disable camelcase */
export interface Hentai {
    id: number
    name: string
    titles: Array<{
        lang: string
        kind: string
        title: string
    }>
    slug: string
    description: string
    views: number
    interests: number
    posterURL: string
    coverURL: string
    brand: {
        id: number
        title: string
        slug: string
        websiteURL: string | null
        logoURL: string | null
        email: string | null
        count: number
    }
    durationInMs: number
    isCensored: boolean
    rating: string
    likes: number
    dislikes: number
    downloads: number
    monthlyRank: number
    tags: Array<{
        id: number
        text: string
    }>
    releasedAt: Date
    url: string
    streamURL: string
    malID: number
    malDescription: string
}
