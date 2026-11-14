import ProductCard, { type CatalogProduct } from './ProductCard'

type ProductGridProps = {
  products: CatalogProduct[]
  catalogSearch: string
  headingLevel?: 'h2' | 'h3'
}

export default function ProductGrid({
  products,
  catalogSearch,
  headingLevel = 'h3',
}: ProductGridProps) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          catalogSearch={catalogSearch}
          headingLevel={headingLevel}
        />
      ))}
    </ul>
  )
}