"""Creates the full schema.dbml schema against DATABASE_URL.

Run once against a fresh Neon database:

    cd backend
    source venv/bin/activate
    python -m db.create_schema

Re-running against a database that already has these tables/types will
error (nothing here is idempotent) — this is meant for a one-time bootstrap
of a fresh database, not a migration tool. If schema.dbml changes, update
the matching block below by hand.
"""

import psycopg2

from config import settings

EXTENSIONS = """
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
"""

ENUMS = """
CREATE TYPE role_name AS ENUM (
    'registered_member', 'volunteer', 'event_coordinator',
    'heritage_expert', 'shop_admin', 'system_admin'
);
CREATE TYPE heritage_category AS ENUM ('built', 'natural', 'craft', 'intangible');
CREATE TYPE site_status AS ENUM ('pending_review', 'approved', 'rejected');
CREATE TYPE event_type AS ENUM (
    'heritage_walk', 'workshop', 'quiz', 'competition', 'cultural_event'
);
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE registration_status AS ENUM ('confirmed', 'waitlisted', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_purpose AS ENUM ('event_registration', 'shop_order');
CREATE TYPE payment_status AS ENUM ('initiated', 'succeeded', 'failed', 'refunded');
CREATE TYPE chat_role AS ENUM ('user', 'assistant');
"""

IDENTITY_ACCESS = """
CREATE TABLE languages (
    code TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    preferred_language_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role role_name NOT NULL,
    PRIMARY KEY (user_id, role)
);
"""

HERITAGE_CATALOGUE = """
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE,
    boundary GEOGRAPHY(POLYGON, 4326),
    description TEXT
);

CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE,
    description TEXT
);

CREATE TABLE heritage_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    category heritage_category,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    construction_period TEXT,
    historical_significance TEXT,
    description TEXT,
    image_url TEXT,
    status site_status,
    submitted_by UUID,
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    region_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE heritage_site_themes (
    site_id UUID NOT NULL,
    theme_id UUID NOT NULL,
    PRIMARY KEY (site_id, theme_id)
);
"""

TRAILS_VOICE_GUIDE = """
CREATE TABLE heritage_trails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    region_id UUID,
    theme_id UUID,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE heritage_trail_stops (
    trail_id UUID NOT NULL,
    site_id UUID,
    sequence_order INT NOT NULL,
    PRIMARY KEY (trail_id, sequence_order)
);

CREATE TABLE voice_guide_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID,
    language_code TEXT,
    script_text TEXT,
    audio_url TEXT,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""

EVENTS_REGISTRATION = """
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    event_type event_type,
    site_id UUID,
    venue TEXT,
    event_date DATE,
    start_time TIME,
    end_time TIME,
    participant_limit INT,
    registration_deadline TIMESTAMPTZ,
    coordinator_id UUID,
    status event_status,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    user_id UUID,
    status registration_status,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payment_id UUID
);
"""

SHOP_PAYMENTS = """
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE,
    name TEXT,
    description TEXT,
    category TEXT,
    price_cents INT,
    stock_quantity INT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID,
    change_qty INT,
    reason TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID,
    status order_status,
    total_cents INT,
    shipping_address TEXT,
    payment_id UUID,
    placed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID,
    product_id UUID,
    quantity INT,
    unit_price_cents INT
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payer_id UUID,
    purpose payment_purpose,
    amount_cents INT,
    currency TEXT,
    status payment_status,
    gateway_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""

AI_CHATBOT = """
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    role chat_role,
    content TEXT,
    referenced_site_ids UUID[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE heritage_site_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID,
    content_chunk TEXT,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""

FOREIGN_KEYS = """
ALTER TABLE users
    ADD CONSTRAINT fk_users_preferred_language FOREIGN KEY (preferred_language_code) REFERENCES languages(code);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE heritage_sites
    ADD CONSTRAINT fk_heritage_sites_submitted_by FOREIGN KEY (submitted_by) REFERENCES users(id),
    ADD CONSTRAINT fk_heritage_sites_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id),
    ADD CONSTRAINT fk_heritage_sites_region FOREIGN KEY (region_id) REFERENCES regions(id);

ALTER TABLE heritage_site_themes
    ADD CONSTRAINT fk_heritage_site_themes_site FOREIGN KEY (site_id) REFERENCES heritage_sites(id),
    ADD CONSTRAINT fk_heritage_site_themes_theme FOREIGN KEY (theme_id) REFERENCES themes(id);

ALTER TABLE heritage_trails
    ADD CONSTRAINT fk_heritage_trails_region FOREIGN KEY (region_id) REFERENCES regions(id),
    ADD CONSTRAINT fk_heritage_trails_theme FOREIGN KEY (theme_id) REFERENCES themes(id),
    ADD CONSTRAINT fk_heritage_trails_created_by FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE heritage_trail_stops
    ADD CONSTRAINT fk_heritage_trail_stops_trail FOREIGN KEY (trail_id) REFERENCES heritage_trails(id),
    ADD CONSTRAINT fk_heritage_trail_stops_site FOREIGN KEY (site_id) REFERENCES heritage_sites(id);

ALTER TABLE voice_guide_scripts
    ADD CONSTRAINT fk_voice_guide_scripts_site FOREIGN KEY (site_id) REFERENCES heritage_sites(id),
    ADD CONSTRAINT fk_voice_guide_scripts_language FOREIGN KEY (language_code) REFERENCES languages(code);

ALTER TABLE events
    ADD CONSTRAINT fk_events_site FOREIGN KEY (site_id) REFERENCES heritage_sites(id),
    ADD CONSTRAINT fk_events_coordinator FOREIGN KEY (coordinator_id) REFERENCES users(id);

ALTER TABLE event_registrations
    ADD CONSTRAINT fk_event_registrations_event FOREIGN KEY (event_id) REFERENCES events(id),
    ADD CONSTRAINT fk_event_registrations_user FOREIGN KEY (user_id) REFERENCES users(id),
    ADD CONSTRAINT fk_event_registrations_payment FOREIGN KEY (payment_id) REFERENCES payments(id);

ALTER TABLE products
    ADD CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE inventory_logs
    ADD CONSTRAINT fk_inventory_logs_product FOREIGN KEY (product_id) REFERENCES products(id),
    ADD CONSTRAINT fk_inventory_logs_created_by FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    ADD CONSTRAINT fk_orders_payment FOREIGN KEY (payment_id) REFERENCES payments(id);

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    ADD CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE payments
    ADD CONSTRAINT fk_payments_payer FOREIGN KEY (payer_id) REFERENCES users(id);

ALTER TABLE chat_sessions
    ADD CONSTRAINT fk_chat_sessions_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE chat_messages
    ADD CONSTRAINT fk_chat_messages_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id);

ALTER TABLE heritage_site_embeddings
    ADD CONSTRAINT fk_heritage_site_embeddings_site FOREIGN KEY (site_id) REFERENCES heritage_sites(id);
"""

INDEXES = """
CREATE UNIQUE INDEX ux_voice_guide_scripts_site_language ON voice_guide_scripts (site_id, language_code);
CREATE UNIQUE INDEX ux_event_registrations_event_user ON event_registrations (event_id, user_id);
"""

# Mirrors schema.dbml's own TableGroups; foreign keys/indexes are applied
# last so table-creation order doesn't need to match FK dependency order.
STATEMENT_GROUPS: list[tuple[str, str]] = [
    ("extensions", EXTENSIONS),
    ("enums", ENUMS),
    ("identity_access", IDENTITY_ACCESS),
    ("heritage_catalogue", HERITAGE_CATALOGUE),
    ("trails_voice_guide", TRAILS_VOICE_GUIDE),
    ("events_registration", EVENTS_REGISTRATION),
    ("shop_payments", SHOP_PAYMENTS),
    ("ai_chatbot", AI_CHATBOT),
    ("foreign_keys", FOREIGN_KEYS),
    ("indexes", INDEXES),
]


def main() -> None:
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            for name, sql in STATEMENT_GROUPS:
                print(f"applying {name}...")
                cur.execute(sql)
        conn.commit()
        print("Schema created successfully.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
