import ProductList from "@/components/product-list"
import { Suspense } from "react"
import ProductListSkeleton from "@/components/product-list-skeleton"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Jin's Store</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </main>
  )
}

