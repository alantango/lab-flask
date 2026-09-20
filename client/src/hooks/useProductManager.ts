import { useCallback, useEffect, useState } from 'react'
import { createProduct, getProducts, removeProduct, updateProduct } from '@api/products'
import type { Product, ProductDraft } from '@models/product'

const emptyDraft: ProductDraft = { category: '', name: '', price: 0 }

export function useProductManager() {
    const [products, setProducts] = useState<Product[]>([])
    const [draft, setDraft] = useState<ProductDraft>(emptyDraft)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [status, setStatus] = useState('Loading products...')

    const loadProducts = useCallback(async () => {
        const latestProducts = await getProducts()
        setProducts(latestProducts)
        setStatus('')
    }, [])

    useEffect(() => {
        loadProducts().catch((error: Error) => setStatus(error.message))
    }, [loadProducts])

    function updateDraft(field: keyof ProductDraft, value: string) {
        setDraft((current) => ({ ...current, [field]: field === 'price' ? Number(value) : value }))
    }

    function editProduct(product: Product) {
        setEditingId(product.id)
        setDraft({ category: product.category, name: product.name, price: product.price })
    }

    function cancelEditing() {
        setEditingId(null)
        setDraft(emptyDraft)
    }

    async function saveProduct() {
        try {
            setStatus('Saving product...')
            if (editingId === null) {
                await createProduct(draft)
            } else {
                await updateProduct(editingId, draft)
            }
            await loadProducts()
            cancelEditing()
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Could not save product')
        }
    }

    async function deleteProduct(product: Product) {
        try {
            setStatus('Deleting product...')
            await removeProduct(product.id)
            await loadProducts()
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Could not delete product')
        }
    }

    return {
        products,
        draft,
        editingId,
        status,
        updateDraft,
        editProduct,
        cancelEditing,
        saveProduct,
        deleteProduct,
    }
}
