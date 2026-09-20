export type Product = {
    id: number
    category: string
    name: string
    price: number
}

export type ProductDraft = Omit<Product, 'id'>
