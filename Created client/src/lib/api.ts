export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  badge?: string | null;
  originalPrice?: string | null;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface CartResponse {
  items: CartItemWithProduct[];
  total: string;
  itemCount: number;
}
