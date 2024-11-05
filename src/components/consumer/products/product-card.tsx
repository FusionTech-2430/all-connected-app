import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductCardProps {
  product: {
    id: number
    name: string
    description: string
    photoUrl: string | null
    price: number
    rating?: number
  }
  onViewProduct: (id: number) => void
}

export function ProductCard({ product, onViewProduct }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex justify-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center">
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full h-40 mb-3 cursor-pointer overflow-hidden rounded-lg">
            {product.photoUrl ? (
              <Image
                src={product.photoUrl}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                No image
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          {product.photoUrl && (
            <Image
              src={product.photoUrl}
              alt={product.name}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
      <h4 className="font-semibold text-center text-sm">{product.name}</h4>
      <p className="text-xs text-gray-600 mb-2 text-center line-clamp-2">{product.description}</p>
      <p className="text-lg font-bold mb-2">${product.price.toLocaleString()}</p>
      {product.rating !== null && product.rating !== undefined && (
        <div className="mb-2">
          <p className="text-xs text-gray-600 text-center">Rating: {product.rating.toFixed(1)}</p>
          {renderStars(product.rating)}
        </div>
      )}
      <Button className="w-full text-sm" onClick={() => onViewProduct(product.id)}>Ver Producto</Button>
    </div>
  )
}