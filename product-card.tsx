import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  isLoading?: boolean;
}

export default function ProductCard({ product, onAddToCart, isLoading }: ProductCardProps) {
  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "default"; // blue
      case "Sale":
        return "destructive"; // red
      case "New":
        return "secondary"; // green
      default:
        return "default";
    }
  };

  const getBadgeClassName = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-blue-500 text-white";
      case "Sale":
        return "bg-red-500 text-white";
      case "New":
        return "bg-green-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge className={`${getBadgeClassName(product.badge)} px-2 py-1 rounded-full text-xs font-medium`}>
              {product.badge}
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-600 line-through">${product.originalPrice}</span>
            )}
          </div>
          <Button 
            onClick={() => onAddToCart(product.id)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
  
