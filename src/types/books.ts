export type Book = {
    id: number
    title: string
    author: string
    publisher?: string
    pages?: number
    gotDate?: string
    readDate?: string
    price?: number
    image?: string
    link?: string
    mode: 'Book' | 'PDF'
    status: 'Reading' | 'Read' | 'Unread'
}