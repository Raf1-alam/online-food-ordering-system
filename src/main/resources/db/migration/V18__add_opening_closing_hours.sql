ALTER TABLE restaurants
    ADD COLUMN opening_time VARCHAR(10) DEFAULT '09:00',
    ADD COLUMN closing_time VARCHAR(10) DEFAULT '22:00';
