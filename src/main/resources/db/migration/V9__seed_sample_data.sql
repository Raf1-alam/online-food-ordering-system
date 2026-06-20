-- ==============================================================
-- V9: Seed sample restaurants and menu items
-- ==============================================================

-- 1. Create a Restaurant Owner (Staff)
INSERT INTO users (full_name, email, password, role, active, created_at, updated_at)
VALUES (
    'Gordon Ramsay',
    'gordon@hellskitchen.com',
    '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', -- admin123
    'RESTAURANT_STAFF',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 2. Create Restaurants
-- We assume Gordon's user ID is 2 (since Admin is 1)
INSERT INTO restaurants (name, address, phone, description, owner_id, active, created_at, updated_at)
VALUES 
('Hells Kitchen', '123 Strip Blvd, Las Vegas', '555-0100', 'World renowned premium dining.', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Burger Palace', '456 Fast Food Ln, NY', '555-0200', 'The best gourmet burgers in town.', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Create Menu Items for Hells Kitchen (restaurant_id = 1)
INSERT INTO menu_items (name, description, price, category, available, restaurant_id, created_at, updated_at)
VALUES
('Beef Wellington', 'Signature dish served with potato puree and glazed root vegetables.', 45.99, 'MAINS', TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pan-Seared Scallops', 'Served with sweet corn puree and pancetta.', 28.50, 'STARTERS', TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sticky Toffee Pudding', 'Warm date cake with caramel sauce and vanilla ice cream.', 14.00, 'DESSERTS', TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Create Menu Items for Burger Palace (restaurant_id = 2)
INSERT INTO menu_items (name, description, price, category, available, restaurant_id, created_at, updated_at)
VALUES
('Truffle Mushroom Burger', 'Angus beef patty with truffle aioli and swiss cheese.', 16.99, 'MAINS', TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spicy Crispy Chicken', 'Fried chicken breast with spicy slaw and pickles.', 14.50, 'MAINS', TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Loaded Truffle Fries', 'Crispy fries topped with parmesan and truffle oil.', 8.99, 'SIDES', TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
