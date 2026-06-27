-- ==============================================================
-- V12: Seed realistic dummy data (Foodpanda / Foodie style)
-- ==============================================================
-- Password for all seeded users: admin123
-- BCrypt hash: $2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK

-- ==================== RESTAURANT STAFF / OWNERS ====================

INSERT INTO users (full_name, email, password, phone, role, active, created_at, updated_at) VALUES
('Karim Uddin',        'karim@kacchihouse.com',   '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01711-223344', 'RESTAURANT_STAFF', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mei Lin Chen',       'mei@dragonwok.com',       '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01722-334455', 'RESTAURANT_STAFF', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marco Rossi',        'marco@bellanapoli.com',   '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01733-445566', 'RESTAURANT_STAFF', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Somchai Prasert',    'somchai@thaibasil.com',   '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01744-556677', 'RESTAURANT_STAFF', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rafiq Ahmed',        'rafiq@streetbites.com',   '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01755-667788', 'RESTAURANT_STAFF', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ==================== CUSTOMERS ====================

INSERT INTO users (full_name, email, password, phone, role, active, created_at, updated_at) VALUES
('Tanvir Hasan',       'tanvir@gmail.com',     '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01811-112233', 'CUSTOMER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nusrat Jahan',       'nusrat@gmail.com',     '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01822-223344', 'CUSTOMER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Arif Rahman',        'arif@gmail.com',       '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01833-334455', 'CUSTOMER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fatema Akter',       'fatema@gmail.com',     '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01844-445566', 'CUSTOMER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sohel Rana',         'sohel@gmail.com',      '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK', '01855-556677', 'CUSTOMER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ==================== RESTAURANTS ====================
-- owner_id references: Karim=3, Mei=4, Marco=5, Somchai=6, Rafiq=7
-- (Admin=1, Gordon=2 from earlier migrations)

INSERT INTO restaurants (name, address, phone, description, owner_id, active, created_at, updated_at) VALUES
('Kacchi Bhai',        'House 12, Road 5, Dhanmondi, Dhaka',        '01711-223344', 'Authentic Dhakaiya kacchi biriyani and traditional Mughlai cuisine. The taste of old Dhaka at your doorstep.', 3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dragon Wok',         'Level 3, Jamuna Future Park, Dhaka',        '01722-334455', 'Premium Chinese and Pan-Asian cuisine with hand-pulled noodles, dim sum, and sizzling wok specials.', 4, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bella Napoli',       'Gulshan Avenue, Gulshan-2, Dhaka',          '01733-445566', 'Wood-fired pizzas, handmade pasta, and classic Italian flavors imported straight from Naples.', 5, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thai Basil Kitchen', 'Banani Road 11, Block F, Dhaka',            '01744-556677', 'Aromatic Thai curries, fresh pad thai, and coconut-infused desserts crafted by Thai chef Somchai.', 6, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Street Bites Dhaka', 'Mirpur 10 Roundabout, Dhaka',               '01755-667788', 'Best Dhaka street food elevated — fuchka, chotpoti, jhalmuri, and loaded burgers.', 7, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sushi Samurai',      'Uttara Sector 4, House 8, Dhaka',           '01766-778899', 'Fresh sushi rolls, ramen bowls, and Japanese bento boxes prepared with precision.', 4, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ==================== MENU ITEMS ====================
-- Restaurants from previous V9: Hells Kitchen=1, Burger Palace=2
-- New restaurants: Kacchi Bhai=3, Dragon Wok=4, Bella Napoli=5, Thai Basil=6, Street Bites=7, Sushi Samurai=8

-- ---------- Kacchi Bhai (Restaurant 3) ----------
INSERT INTO menu_items (name, description, price, category, available, image_url, restaurant_id, created_at, updated_at) VALUES
('Kacchi Biriyani (Full)',   'Slow-cooked aromatic rice layered with tender marinated mutton and secret spices. Served with borhani.', 350.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kacchi Biriyani (Half)',   'Half portion of our signature kacchi biriyani with mutton.', 200.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tehari',                   'Fragrant beef tehari cooked in mustard oil with whole spices and potatoes.', 180.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chicken Rezala',           'Creamy white curry with tender chicken, cashews, and aromatic spices.', 280.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mutton Chaap',             'Juicy grilled mutton ribs marinated in special yogurt-based masala.', 320.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jali Kabab',               'Traditional minced meat kebab wrapped in egg net. A Dhaka classic.', 150.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Borhani',                  'Spiced yogurt drink — the perfect companion to biriyani.', 60.00,  'DRINKS', TRUE, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Firni',                    'Chilled rice pudding topped with pistachios and saffron.', 80.00,  'DESSERTS', TRUE, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Shahi Tukra',              'Royal bread pudding soaked in sweetened milk with rose water and nuts.', 120.00, 'DESSERTS', TRUE, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------- Dragon Wok (Restaurant 4) ----------
INSERT INTO menu_items (name, description, price, category, available, image_url, restaurant_id, created_at, updated_at) VALUES
('Chicken Chow Mein',       'Stir-fried egg noodles with chicken, vegetables, and soy sauce.', 250.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sweet & Sour Chicken',    'Crispy battered chicken tossed in tangy sweet and sour sauce.', 280.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kung Pao Shrimp',         'Spicy stir-fried shrimp with peanuts, chili peppers, and Sichuan pepper.', 350.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dim Sum Platter',         'Assorted steamed dumplings — har gow, siu mai, and char siu bao (6 pcs).', 300.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hot & Sour Soup',         'Classic Sichuan-style soup with tofu, mushrooms, and egg ribbons.', 150.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fried Rice (Special)',    'Wok-tossed rice with eggs, shrimp, chicken, and mixed vegetables.', 220.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spring Rolls (4 pcs)',    'Crispy vegetable spring rolls served with sweet chili dip.', 120.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1548507200-e9cbb0e81969?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mango Pudding',           'Silky smooth mango pudding with fresh cream.', 100.00, 'DESSERTS', TRUE, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------- Bella Napoli (Restaurant 5) ----------
INSERT INTO menu_items (name, description, price, category, available, image_url, restaurant_id, created_at, updated_at) VALUES
('Margherita Pizza',         'San Marzano tomato sauce, fresh mozzarella, and basil on a wood-fired crust.', 450.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pepperoni Pizza',          'Classic pepperoni with mozzarella and our secret tomato sauce.', 520.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BBQ Chicken Pizza',        'Grilled chicken, BBQ sauce, red onion, and smoked gouda.', 550.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spaghetti Carbonara',      'Al dente spaghetti with pancetta, egg yolk, parmesan, and black pepper.', 380.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fettuccine Alfredo',       'Creamy parmesan sauce with butter-tossed fettuccine and grilled chicken.', 400.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bruschetta',               'Toasted ciabatta topped with diced tomatoes, garlic, basil, and olive oil.', 180.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Caesar Salad',             'Crisp romaine lettuce with croutons, parmesan shavings, and Caesar dressing.', 220.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tiramisu',                 'Classic Italian dessert with mascarpone, espresso-soaked ladyfingers, and cocoa.', 250.00, 'DESSERTS', TRUE, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Garlic Bread',             'Warm buttery bread with roasted garlic and melted mozzarella.', 120.00, 'SIDES', TRUE, 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------- Thai Basil Kitchen (Restaurant 6) ----------
INSERT INTO menu_items (name, description, price, category, available, image_url, restaurant_id, created_at, updated_at) VALUES
('Pad Thai',                 'Stir-fried rice noodles with shrimp, tofu, peanuts, and tamarind sauce.', 280.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Green Curry Chicken',      'Aromatic Thai green curry with coconut milk, bamboo shoots, and Thai basil.', 320.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Red Curry Beef',           'Rich red curry with tender beef, bell peppers, and kaffir lime leaves.', 350.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tom Yum Soup',             'Spicy and sour Thai soup with shrimp, mushrooms, and lemongrass.', 200.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thai Iced Tea',            'Sweet and creamy Thai tea served over crushed ice.', 80.00,  'DRINKS', TRUE, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mango Sticky Rice',        'Sweet glutinous rice with fresh mango slices and coconut cream.', 180.00, 'DESSERTS', TRUE, 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Satay Skewers (4 pcs)',    'Grilled chicken skewers with peanut dipping sauce and cucumber relish.', 200.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------- Street Bites Dhaka (Restaurant 7) ----------
INSERT INTO menu_items (name, description, price, category, available, image_url, restaurant_id, created_at, updated_at) VALUES
('Fuchka (8 pcs)',           'Crispy hollow puris filled with spiced chickpeas and tangy tamarind water.', 80.00,  'STARTERS', TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chotpoti',                 'Spicy chickpea curry with boiled egg, onion, and tamarind chutney.', 70.00,  'STARTERS', TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jhalmuri',                 'Puffed rice tossed with mustard oil, onion, chili, and peanuts.', 50.00,  'STARTERS', TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Smash Burger',             'Double smashed beef patties with cheddar, pickles, and special sauce.', 250.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Loaded Fries',             'Crispy fries topped with cheese sauce, jalapeños, and crispy onions.', 180.00, 'SIDES', TRUE, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chicken Wrap',             'Grilled chicken, lettuce, tomato, and garlic mayo in a soft tortilla.', 200.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mojo Mojito',              'Fresh mint and lime mocktail with soda and crushed ice.', 100.00, 'DRINKS', TRUE, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chocolate Brownie',        'Warm fudgy brownie served with vanilla ice cream and chocolate drizzle.', 150.00, 'DESSERTS', TRUE, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------- Sushi Samurai (Restaurant 8) ----------
INSERT INTO menu_items (name, description, price, category, available, image_url, restaurant_id, created_at, updated_at) VALUES
('California Roll (8 pcs)',  'Crab, avocado, and cucumber wrapped in sushi rice and nori.', 350.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Salmon Nigiri (4 pcs)',    'Fresh Atlantic salmon slices over seasoned sushi rice.', 400.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spicy Tuna Roll (8 pcs)', 'Spicy tuna with sriracha mayo, cucumber, and sesame seeds.', 380.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tonkotsu Ramen',           'Rich pork bone broth with chashu, soft-boiled egg, nori, and scallions.', 320.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chicken Katsu Bento',      'Crispy chicken cutlet with rice, miso soup, pickled vegetables, and salad.', 350.00, 'MAINS', TRUE, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Edamame',                  'Steamed soybean pods sprinkled with sea salt.', 100.00, 'STARTERS', TRUE, 'https://images.unsplash.com/photo-1564671165093-20688ff1fffa?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Miso Soup',                'Traditional Japanese soup with tofu, wakame seaweed, and green onion.', 80.00,  'STARTERS', TRUE, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Matcha Ice Cream',         'Creamy Japanese green tea ice cream (2 scoops).', 120.00, 'DESSERTS', TRUE, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ==================== SAMPLE ORDERS ====================
-- Customers: Tanvir=8, Nusrat=9, Arif=10, Fatema=11, Sohel=12

-- Order 1: Tanvir orders from Kacchi Bhai (DELIVERED)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (8, 3, 760.00, 'DELIVERED', 'House 45, Road 8, Dhanmondi, Dhaka', 4, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(1, (SELECT id FROM menu_items WHERE name = 'Kacchi Biriyani (Full)'), 'Kacchi Biriyani (Full)', 350.00, 2),
(1, (SELECT id FROM menu_items WHERE name = 'Borhani'), 'Borhani', 60.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (1, 760.00, 'BKASH', 'COMPLETED', 'BKS-20250622-001', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Order 2: Nusrat orders from Bella Napoli (DELIVERED)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (9, 5, 1070.00, 'DELIVERED', 'Apt 12B, Gulshan Circle-2, Dhaka', 4, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(2, (SELECT id FROM menu_items WHERE name = 'Margherita Pizza'), 'Margherita Pizza', 450.00, 1),
(2, (SELECT id FROM menu_items WHERE name = 'Spaghetti Carbonara'), 'Spaghetti Carbonara', 380.00, 1),
(2, (SELECT id FROM menu_items WHERE name = 'Tiramisu'), 'Tiramisu', 250.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (2, 1070.00, 'CREDIT_CARD', 'COMPLETED', 'CC-20250623-002', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Order 3: Arif orders from Dragon Wok (PREPARING)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (10, 4, 700.00, 'PREPARING', 'Banani Block C, House 3, Dhaka', 2, DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(3, (SELECT id FROM menu_items WHERE name = 'Chicken Chow Mein'), 'Chicken Chow Mein', 250.00, 1),
(3, (SELECT id FROM menu_items WHERE name = 'Dim Sum Platter'), 'Dim Sum Platter', 300.00, 1),
(3, (SELECT id FROM menu_items WHERE name = 'Hot & Sour Soup'), 'Hot & Sour Soup', 150.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (3, 700.00, 'BKASH', 'COMPLETED', 'BKS-20250627-003', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- Order 4: Fatema orders from Thai Basil (OUT_FOR_DELIVERY)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (11, 6, 880.00, 'OUT_FOR_DELIVERY', 'Uttara Sector 7, Road 14, Dhaka', 3, DATE_SUB(NOW(), INTERVAL 45 MINUTE), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(4, (SELECT id FROM menu_items WHERE name = 'Pad Thai'), 'Pad Thai', 280.00, 1),
(4, (SELECT id FROM menu_items WHERE name = 'Green Curry Chicken'), 'Green Curry Chicken', 320.00, 1),
(4, (SELECT id FROM menu_items WHERE name = 'Thai Iced Tea'), 'Thai Iced Tea', 80.00, 2),
(4, (SELECT id FROM menu_items WHERE name = 'Mango Sticky Rice'), 'Mango Sticky Rice', 180.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (4, 880.00, 'CREDIT_CARD', 'COMPLETED', 'CC-20250627-004', DATE_SUB(NOW(), INTERVAL 45 MINUTE));

-- Order 5: Sohel orders from Street Bites (PLACED - just ordered)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (12, 7, 560.00, 'PLACED', 'Mirpur DOHS, Road 2, House 10, Dhaka', 0, NOW(), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(5, (SELECT id FROM menu_items WHERE name = 'Smash Burger'), 'Smash Burger', 250.00, 1),
(5, (SELECT id FROM menu_items WHERE name = 'Loaded Fries'), 'Loaded Fries', 180.00, 1),
(5, (SELECT id FROM menu_items WHERE name = 'Chocolate Brownie'), 'Chocolate Brownie', 150.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (5, 560.00, 'BKASH', 'COMPLETED', 'BKS-20250627-005', NOW());

-- Order 6: Tanvir orders from Sushi Samurai (CONFIRMED)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (8, 8, 1130.00, 'CONFIRMED', 'House 45, Road 8, Dhanmondi, Dhaka', 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(6, (SELECT id FROM menu_items WHERE name = 'California Roll (8 pcs)'), 'California Roll (8 pcs)', 350.00, 1),
(6, (SELECT id FROM menu_items WHERE name = 'Spicy Tuna Roll (8 pcs)'), 'Spicy Tuna Roll (8 pcs)', 380.00, 1),
(6, (SELECT id FROM menu_items WHERE name = 'Tonkotsu Ramen'), 'Tonkotsu Ramen', 320.00, 1),
(6, (SELECT id FROM menu_items WHERE name = 'Miso Soup'), 'Miso Soup', 80.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (6, 1130.00, 'CREDIT_CARD', 'COMPLETED', 'CC-20250627-006', DATE_SUB(NOW(), INTERVAL 30 MINUTE));

-- Order 7: Nusrat orders from Kacchi Bhai (DELIVERED - older)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (9, 3, 530.00, 'DELIVERED', 'Apt 12B, Gulshan Circle-2, Dhaka', 4, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(7, (SELECT id FROM menu_items WHERE name = 'Kacchi Biriyani (Full)'), 'Kacchi Biriyani (Full)', 350.00, 1),
(7, (SELECT id FROM menu_items WHERE name = 'Shahi Tukra'), 'Shahi Tukra', 120.00, 1),
(7, (SELECT id FROM menu_items WHERE name = 'Borhani'), 'Borhani', 60.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (7, 530.00, 'BKASH', 'COMPLETED', 'BKS-20250620-007', DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Order 8: Arif orders from Street Bites (CANCELLED)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (10, 7, 330.00, 'CANCELLED', 'Banani Block C, House 3, Dhaka', 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(8, (SELECT id FROM menu_items WHERE name = 'Fuchka (8 pcs)'), 'Fuchka (8 pcs)', 80.00, 1),
(8, (SELECT id FROM menu_items WHERE name = 'Smash Burger'), 'Smash Burger', 250.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (8, 330.00, 'BKASH', 'REFUNDED', 'BKS-20250624-008', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Order 9: Fatema orders from Bella Napoli (DELIVERED)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (11, 5, 640.00, 'DELIVERED', 'Uttara Sector 7, Road 14, Dhaka', 4, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(9, (SELECT id FROM menu_items WHERE name = 'Pepperoni Pizza'), 'Pepperoni Pizza', 520.00, 1),
(9, (SELECT id FROM menu_items WHERE name = 'Garlic Bread'), 'Garlic Bread', 120.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (9, 640.00, 'CREDIT_CARD', 'COMPLETED', 'CC-20250625-009', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Order 10: Sohel orders from Hells Kitchen (DELIVERED)
INSERT INTO orders (user_id, restaurant_id, total_amount, status, delivery_address, version, created_at, updated_at)
VALUES (12, 1, 88.49, 'DELIVERED', 'Mirpur DOHS, Road 2, House 10, Dhaka', 4, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW());
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity) VALUES
(10, (SELECT id FROM menu_items WHERE name = 'Beef Wellington'), 'Beef Wellington', 45.99, 1),
(10, (SELECT id FROM menu_items WHERE name = 'Pan-Seared Scallops'), 'Pan-Seared Scallops', 28.50, 1),
(10, (SELECT id FROM menu_items WHERE name = 'Sticky Toffee Pudding'), 'Sticky Toffee Pudding', 14.00, 1);
INSERT INTO payments (order_id, amount, method, status, transaction_ref, paid_at)
VALUES (10, 88.49, 'CREDIT_CARD', 'COMPLETED', 'CC-20250621-010', DATE_SUB(NOW(), INTERVAL 6 DAY));
