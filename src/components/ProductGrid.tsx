import ProductCard, { type CatalogProduct } from './ProductCard'

type ProductGridProps = {
  products: CatalogProduct[]
  catalogSearch: string
}

export default function ProductGrid({
  products,
  catalogSearch,
}: ProductGridProps) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          catalogSearch={catalogSearch}
        />
      ))}
    </ul>
  )
}