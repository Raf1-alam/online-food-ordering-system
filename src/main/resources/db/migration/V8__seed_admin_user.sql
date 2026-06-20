-- ==============================================================
-- V8: Seed default admin user
-- ==============================================================
-- Password: admin123 (BCrypt hash with strength 12)
-- In production, change this immediately after first login.

INSERT INTO users (full_name, email, password, role, active)
VALUES (
    'System Admin',
    'admin@ofos.com',
    '$2b$12$jsP0mBlBHohVeEsUp64XVebfanfle696XUAAu//yXSx0pjIuzpxcK',
    'ADMIN',
    TRUE
);
