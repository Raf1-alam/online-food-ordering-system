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
  imageUrl?: string;
  openingTime?: string;
  closingTime?: string;
  isCurrentlyOpen?: boolean;
  distance?: number | null;
  latitude?: number | null;
  longitude?: number | null;
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
  itemName: string;
  itemPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PaymentInfo {
  method: string;
  status: string;
  transactionRef: string;
  paidAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  customerName?: string;
  restaurantId: number;
  restaurantName: string;
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryAddress: string;
  estimatedDeliveryTime?: string;
  items: OrderItem[];
  payment?: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}
