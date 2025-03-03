import { getProductById } from "@/lib/mongodb"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center gap-2 text-muted-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">{product.category}</p>
            </div>
            <p className="text-2xl font-bold">{product.price.toFixed(2)}</p>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold mb-2">Stock</h2>
            <p>{product.stock} units available</p>
          </div>

          <div className="pt-4 border-t flex justify-between">
            <p className="text-sm text-muted-foreground">Added on {new Date(product.createdAt).toLocaleDateString()}</p>
            <Link href={`/products/${product._id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

