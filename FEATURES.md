# Online Food Ordering System - Features

This document outlines the core and extended features of the Online Food Ordering System.

## Core Architecture
- **Tech Stack:** Spring Boot 3 (Java 17), React 19 (TypeScript, Vite), Tailwind CSS v3, MySQL 8.0, Docker.
- **Security:** Stateless JWT authentication, role-based access control (CUSTOMER, ADMIN, RESTAURANT_STAFF).
- **Design Pattern:** State Pattern (for Orders), Strategy Pattern (for Payments).
- **Aesthetics:** Custom "Foody" premium design with warm dark mode, neon accents, and Framer Motion animations.

## Existing Features
1. **User Authentication:** Registration, login, and secure JWT token generation.
2. **Role Management:** Distinct views and capabilities for Customers, Admins, and Staff.
3. **Restaurant Onboarding:** Workflow for restaurants to apply and admins to approve them.
4. **Menu Management:** Staff can manage food items, categories, pricing, and images.
5. **Shopping Cart:** Users can add items from a single restaurant to a persistent cart.
6. **Order Processing:** State-driven order lifecycle (Placed, Confirmed, Preparing, Delivery, Delivered).
7. **Basic Checkout:** Cash on Delivery implementation via Strategy pattern.

## New Features (The Expansion Pack)

### 1. User Reviews & Ratings
- Customers can leave a 1-5 star rating and text review on restaurants after an order.
- Average rating dynamically displayed on restaurant cards.

### 2. Favorites / Wishlist
- Customers can "heart" restaurants to add them to a personal favorites list.
- Quick access to favorite spots without searching.

### 3. Visual Order Status Tracker
- Interactive progress bar visualizing the current state of an active order in real-time.
- Icons highlighting the progression (Cooking -> On the Way -> Delivered).

### 4. Promo Codes / Discount System
- Admins can generate discount codes (e.g., `FOODY20`).
- Customers can apply these codes at checkout for a percentage or flat discount on their cart total.

### 5. Advanced Frontend Search & Filters
- Real-time search by restaurant name, description, or category.
- Ability to sort restaurants by Highest Rated or Name instantly without backend calls.
