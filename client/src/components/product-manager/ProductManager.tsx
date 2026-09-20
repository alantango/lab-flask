import type { FormEvent } from 'react'
import { ProductList } from '@components/product-list/ProductList'
import { useProductManager } from '@hooks/useProductManager'

export function ProductManager() {
    const {
        products,
        draft,
        editingId,
        status,
        updateDraft,
        editProduct,
        cancelEditing,
        saveProduct,
        deleteProduct,
    } = useProductManager()

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        void saveProduct()
    }

    function handleDelete(product: Parameters<typeof deleteProduct>[0]) {
        if (window.confirm(`Delete ${product.name}?`)) {
            void deleteProduct(product)
        }
    }

    return (
        <main className="manager-shell">
            <header className="page-header">
                <p className="eyebrow">Inventory desk</p>
                <h1>Product manager</h1>
                <p>Keep your catalog tidy and ready for the next order.</p>
            </header>
            <section className="manager-grid">
                <form className="product-form" onSubmit={handleSubmit}>
                    <h2>{editingId === null ? 'Add product' : 'Edit product'}</h2>
                    <label>Category<input required value={draft.category} onChange={(event) => updateDraft('category', event.target.value)} /></label>
                    <label>Name<input required value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} /></label>
                    <label>Price<input required min="0" step="0.01" type="number" value={draft.price} onChange={(event) => updateDraft('price', event.target.value)} /></label>
                    <div className="form-actions">
                        <button type="submit">{editingId === null ? 'Add product' : 'Save changes'}</button>
                        {editingId !== null && <button type="button" className="quiet" onClick={cancelEditing}>Cancel</button>}
                    </div>
                </form>
                <section className="catalog-panel">
                    <div className="section-heading"><h2>Catalog</h2><span>{products.length} items</span></div>
                    {status ? <p className="status">{status}</p> : <ProductList products={products} onEdit={editProduct} onDelete={handleDelete} />}
                </section>
            </section>
        </main>
    )
}
