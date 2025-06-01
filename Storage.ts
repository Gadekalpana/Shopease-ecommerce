import { products, cartItems, type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";

export interface IStorage {
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  getCartItem(productId: number, sessionId: string): Promise<CartItem | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private productIdCounter: number;
  private cartIdCounter: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.productIdCounter = 1;
    this.cartIdCounter = 1;
    
    this.seedProducts();
  }

  private seedProducts() {
    const mockProducts: Omit<Product, 'id'>[] = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality sound with noise cancellation",
        price: "299.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Audio",
        badge: null,
        originalPrice: null,
      },
      {
        name: "Latest Smartphone",
        description: "Advanced features with 5G connectivity",
        price: "899.99",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Mobile",
        badge: "Best Seller",
        originalPrice: null,
      },
      {
        name: "Ultra-thin Laptop",
        description: "Powerful performance in a sleek design",
        price: "1299.99",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Computing",
        badge: null,
        originalPrice: null,
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your fitness with advanced sensors",
        price: "199.99",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Wearables",
        badge: "Sale",
        originalPrice: "249.99",
      },
      {
        name: "Professional Camera",
        description: "Capture stunning photos with 4K video",
        price: "699.99",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Photography",
        badge: null,
        originalPrice: null,
      },
      {
        name: "Wireless Gaming Controller",
        description: "Enhanced gaming experience with haptic feedback",
        price: "79.99",
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Gaming",
        badge: null,
        originalPrice: null,
      },
      {
        name: "Wireless Charging Pad",
        description: "Fast wireless charging for all devices",
        price: "39.99",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Accessories",
        badge: "New",
        originalPrice: null,
      },
      {
        name: "Portable Bluetooth Speaker",
        description: "360-degree sound with deep bass",
        price: "129.99",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Audio",
        badge: null,
        originalPrice: null,
      },
    ];

    mockProducts.forEach(product => {
      const id = this.productIdCounter++;
      this.products.set(id, { ...product, id });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    const itemsWithProducts: CartItemWithProduct[] = [];
    
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    
    return itemsWithProducts;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = this.cartIdCounter++;
    const cartItem: CartItem = { ...item, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id, _]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
    return true;
  }

  async getCartItem(productId: number, sessionId: string): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values())
      .find(item => item.productId === productId && item.sessionId === sessionId);
  }
}

export const storage = new MemStorage();
        
