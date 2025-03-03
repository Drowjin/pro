import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <Package className="h-6 w-6" />
          <span>Jin's Store</span>
        </Link>
        <nav>
          <Link href="/products/new">
            <Button>Add New Product</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

