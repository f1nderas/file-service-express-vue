export interface IToken {
    accessToken: string
    refreshToken: string
}

export interface IFileItem {
    id: number
    name: string
    extension: string
    mimeType: string
    size: number
    uploadDate: string
    userId: string
}