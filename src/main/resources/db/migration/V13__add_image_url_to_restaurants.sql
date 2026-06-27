-- ==============================================================
-- V13: Add image_url to restaurants table
-- ==============================================================

ALTER TABLE restaurants
ADD COLUMN image_url VARCHAR(500) AFTER description;
