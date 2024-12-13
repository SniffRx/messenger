export interface ChatMessage {
    key: number
    text: string
    time: string
    own: boolean
    type: ContentType
}

export type ContentType = "text" | "image"