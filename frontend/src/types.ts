export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'RESTAURANT_STAFF' | 'ADMIN';
  active: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address?: string;
  rating: number;
  active: boolean;
  ownerId: number;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

export interface CartItem {
  id: number;
  cartId: number;
  menuItem: MenuItem;
  quantity: number;
  priceAtAddition: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItem: MenuItem;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryAddress: string;
  items: OrderItem[];
  createdAt: string;
}
