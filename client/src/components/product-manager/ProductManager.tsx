import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { env } from '@config/env'
import type { Product, ProductDraft } from '@models/product'
import { ProductList } from '@components/product-list/ProductList'

const emptyDraft: ProductDraft = { category: '', name: '', price: 0 }

export function ProductManager() {
    const [products, setProducts] = useState<Product[]>([])
    const [draft, setDraft] = useState<ProductDraft>(emptyDraft)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [status, setStatus] = useState('Loading products...')

    const loadProducts = useCallback(async () => {
        const response = await fetch(`${env.apiBaseUrl}/getproducts`)
        if (!response.ok) throw new Error('Could not load products')
        setProducts(await response.json())
        setStatus('')
    }, [])

    useEffect(() => {
        loadProducts().catch((error: Error) => setStatus(error.message))
    }, [loadProducts])


    function updateDraft(field: keyof ProductDraft, value: string) {
        setDraft((current) => ({ ...current, [field]: field === 'price' ? Number(value) : value }))
    }

    async function saveProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const url = editingId === null ? `${env.apiBaseUrl}/products` : `${env.apiBaseUrl}/products/${editingId}`
        const response = await fetch(url, {
            method: editingId === null ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(draft),
        })
        if (!response.ok) {
            setStatus('Could not save product')
            return
        }
        await loadProducts()
        setDraft(emptyDraft)
        setEditingId(null)
    }

    function editProduct(product: Product) {
        setEditingId(product.id)
        setDraft({ category: product.category, name: product.name, price: product.price })
    }

    async function deleteProduct(product: Product) {
        if (!window.confirm(`Delete ${product.name}?`)) return
        const response = await fetch(`${env.apiBaseUrl}/products/${product.id}`, { method: 'DELETE' })
        if (!response.ok) {
            setStatus('Could not delete product')
            return
        }
        await loadProducts()
    }

    return (
        <main className="manager-shell">
            <header className="page-header">
                <p className="eyebrow">Inventory desk</p>
                <h1>Product manager</h1>
                <p>Keep your catalog tidy and ready for the next order.</p>
            </header>
            <section className="manager-grid">
                <form className="product-form" onSubmit={saveProduct}>
                    <h2>{editingId === null ? 'Add product' : 'Edit product'}</h2>
                    <label>Category<input required value={draft.category} onChange={(event) => updateDraft('category', event.target.value)} /></label>
                    <label>Name<input required value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} /></label>
                    <label>Price<input required min="0" step="0.01" type="number" value={draft.price} onChange={(event) => updateDraft('price', event.target.value)} /></label>
                    <div className="form-actions">
                        <button type="submit">{editingId === null ? 'Add product' : 'Save changes'}</button>
                        {editingId !== null && <button type="button" className="quiet" onClick={() => { setEditingId(null); setDraft(emptyDraft) }}>Cancel</button>}
                    </div>
                </form>
                <section className="catalog-panel">
                    <div className="section-heading"><h2>Catalog</h2><span>{products.length} items</span></div>
                    {status ? <p className="status">{status}</p> : <ProductList products={products} onEdit={editProduct} onDelete={deleteProduct} />}
                </section>
            </section>
        </main>
    )
}
