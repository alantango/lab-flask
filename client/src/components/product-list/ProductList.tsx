import type { Product } from '@models/product'

type ProductListProps = {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
    if (products.length === 0) {
        return <p className="empty-state">No products yet. Add the first one.</p>
    }

    return (
        <div className="product-table-wrapper">
            <table className="product-table">
                <caption className="sr-only">Products</caption>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Category</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.category}</td>
                            <td>{product.name}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>
                                <div className="row-actions">
                                    <button type="button" onClick={() => onEdit(product)}>Edit</button>
                                    <button type="button" className="danger" onClick={() => onDelete(product)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
