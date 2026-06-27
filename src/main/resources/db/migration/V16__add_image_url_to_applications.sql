-- ==============================================================
-- V16: Add restaurant_image_url to restaurant_applications
-- ==============================================================

ALTER TABLE restaurant_applications
ADD COLUMN restaurant_image_url VARCHAR(500) AFTER business_license_url;
