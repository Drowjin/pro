import ProductForm from "@/components/product-form"
import { getProductById } from "@/lib/mongodb"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}

