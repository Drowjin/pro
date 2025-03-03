import { MongoClient, ObjectId } from "mongodb"
import type { Product } from "./types"

// Connection URL
const url = "mongodb+srv://drowjin:1234@atlascluster.rvfn5z6.mongodb.net/product-management?retryWrites=true&w=majority&appName=AtlasCluster"
const dbName = "product-management"

// Create a new MongoClient
const client = new MongoClient(url)

// Database singleton
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect()
}

// Helper function to get the database
export async function getDb() {
  const client = await clientPromise
  return client.db(dbName)
}

// Get all products with pagination, sorting, and filtering
export async function getProducts({
  page = 1,
  limit = 10,
  sort = "name",
  order = "asc",
  category = "",
  search = "",
}: {
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  category?: string
  search?: string
}) {
  const db = await getDb()
  const skip = (page - 1) * limit

  // Build the filter
  const filter: any = {}
  if (category) {
    filter.category = category
  }
  if (search) {
    filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
  }

  // Get total count for pagination
  const totalCount = await db.collection("products").countDocuments(filter)
  const totalPages = Math.ceil(totalCount / limit)

  // Get products with pagination and sorting
  const products = await db
    .collection("products")
    .find(filter)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .toArray()

  return {
    products,
    totalPages,
    currentPage: page,
  }
}

// Get a single product by ID
export async function getProductById(id: string) {
  try {
    const db = await getDb()
    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    })
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

// Create a new product
export async function createProduct(productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDb()
  const now = new Date().toISOString()

  const result = await db.collection("products").insertOne({
    ...productData,
    createdAt: now,
    updatedAt: now,
  })

  return {
    _id: result.insertedId.toString(),
    ...productData,
    createdAt: now,
    updatedAt: now,
  }
}

// Update an existing product
export async function updateProduct(id: string, productData: Partial<Product>) {
  const db = await getDb()
  const now = new Date().toISOString()

  const result = await db.collection("products").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...productData,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  )

  return result
}

// Delete a product
export async function deleteProduct(id: string) {
  const db = await getDb()
  const result = await db.collection("products").deleteOne({
    _id: new ObjectId(id),
  })

  return result.deletedCount === 1
}

