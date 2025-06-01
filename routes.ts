import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, updateCartItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate session ID for cart tracking
  app.use((req, res, next) => {
    if (!req.session.id) {
      req.session.id = Math.random().toString(36).substring(7);
    }
    next();
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get cart items for current session
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const cartItems = await storage.getCartItems(sessionId);
      
      const total = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.product.price) * item.quantity);
      }, 0);
      
      res.json({
        items: cartItems,
        total: total.toFixed(2),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  // Add item to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const { productId, quantity = 1 } = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });

      // Check if item already exists in cart
      const existingItem = await storage.getCartItem(productId, sessionId);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItem = await storage.updateCartItemQuantity(
          existingItem.id, 
          existingItem.quantity + quantity
        );
        res.json(updatedItem);
      } else {
        // Add new item to cart
        const cartItem = await storage.addToCart({
          productId,
          quantity,
          sessionId
        });
        res.json(cartItem);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add item to cart" });
      }
    }
  });

  // Update cart item quantity
  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = updateCartItemSchema.parse(req.body);

      if (quantity <= 0) {
        const removed = await storage.removeFromCart(id);
        if (removed) {
          res.json({ message: "Item removed from cart" });
        } else {
          res.status(404).json({ error: "Cart item not found" });
        }
      } else {
        const updatedItem = await storage.updateCartItemQuantity(id, quantity);
        if (updatedItem) {
          res.json(updatedItem);
        } else {
          res.status(404).json({ error: "Cart item not found" });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update cart item" });
      }
    }
  });

  // Remove item from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const removed = await storage.removeFromCart(id);
      
      if (removed) {
        res.json({ message: "Item removed from cart" });
      } else {
        res.status(404).json({ error: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });

  // Clear entire cart
  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session.id;
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
