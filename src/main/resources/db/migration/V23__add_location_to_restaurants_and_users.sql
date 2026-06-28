ALTER TABLE restaurants ADD COLUMN latitude DECIMAL(10, 7) NULL;
ALTER TABLE restaurants ADD COLUMN longitude DECIMAL(10, 7) NULL;

ALTER TABLE restaurant_applications ADD COLUMN latitude DECIMAL(10, 7) NULL;
ALTER TABLE restaurant_applications ADD COLUMN longitude DECIMAL(10, 7) NULL;

ALTER TABLE users ADD COLUMN latitude DECIMAL(10, 7) NULL;
ALTER TABLE users ADD COLUMN longitude DECIMAL(10, 7) NULL;
