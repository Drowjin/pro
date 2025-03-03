import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ message: "Name, price, and category are required" }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await getProductById(params.id)
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Update the product
    const updatedProduct = await updateProduct(params.id, productData)

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if product exists
    const existingProduct = await getProductById(params.id)
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Delete the product
    const result = await deleteProduct(params.id)

    if (result) {
      return NextResponse.json({ message: "Product deleted successfully" })
    } else {
      return NextResponse.json({ message: "Failed to delete product" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 })
  }
}

