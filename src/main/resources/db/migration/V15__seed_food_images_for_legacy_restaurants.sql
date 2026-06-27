-- ==============================================================
-- V15: Seed food images for legacy restaurants (Burger Palace, Hells Kitchen)
-- ==============================================================

-- Burger Palace
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' WHERE name = 'Truffle Mushroom Burger';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' WHERE name = 'Spicy Crispy Chicken';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' WHERE name = 'Loaded Truffle Fries';

-- Hell's Kitchen
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400' WHERE name = 'Beef Wellington';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' WHERE name = 'Pan-Seared Scallops';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400' WHERE name = 'Sticky Toffee Pudding';
