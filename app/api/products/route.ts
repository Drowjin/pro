import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "name"
    const order = searchParams.get("order") === "desc" ? "desc" : "asc"
    const category = searchParams.get("category") || ""
    const search = searchParams.get("search") || ""

    // Get products with pagination, sorting, and filtering
    const result = await getProducts({
      page,
      limit,
      sort,
      order: order as "asc" | "desc",
      category,
      search,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ message: "Name, price, and category are required" }, { status: 400 })
    }

    // Create the product
    const newProduct = await createProduct(productData)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
  }
}

