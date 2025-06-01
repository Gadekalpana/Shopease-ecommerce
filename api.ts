import { apiRequest } from "./queryClient";
import type { Product, CartResponse } from "../types";

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  // Cart
  getCart: async (): Promise<CartResponse> => {
    const response = await fetch("/api/cart");
    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await apiRequest("POST", "/api/cart", { productId, quantity });
    return response.json();
  },

  updateCartItem: async (id: number, quantity: number) => {
    const response = await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    return response.json();
  },

  removeFromCart: async (id: number) => {
    const response = await apiRequest("DELETE", `/api/cart/${id}`);
    return response.json();
  },

  clearCart: async () => {
    const response = await apiRequest("DELETE", "/api/cart");
    return response.json();
  },
};
      
