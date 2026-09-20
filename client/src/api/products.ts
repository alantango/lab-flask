import { env } from '@config/env'
import type { Product, ProductDraft } from '@models/product'

const productsUrl = `${env.apiBaseUrl}/products`

async function ensureSuccessful(response: Response) {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }
}

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${env.apiBaseUrl}/getproducts`)
    await ensureSuccessful(response)
    return response.json()
}

export async function createProduct(product: ProductDraft): Promise<Product> {
    const response = await fetch(productsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    })
    await ensureSuccessful(response)
    return response.json()
}

export async function updateProduct(id: number, product: ProductDraft): Promise<Product> {
    const response = await fetch(`${productsUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    })
    await ensureSuccessful(response)
    return response.json()
}

export async function removeProduct(id: number): Promise<void> {
    const response = await fetch(`${productsUrl}/${id}`, { method: 'DELETE' })
    await ensureSuccessful(response)
}
