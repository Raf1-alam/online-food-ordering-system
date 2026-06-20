-- ==============================================================
-- V3: Create menu_items table
-- ==============================================================

CREATE TABLE menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    restaurant_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_menu_item_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_menu_item_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_item_category ON menu_items(category);
