"""One-off seed script: creates user2@example.com (if missing) and gives
them a realistic history to exercise the volunteer-facing pages:

- Registrations (mixed confirmed/cancelled) on existing past (completed)
  events, so "Your event history" has real rows.
- Heritage-site submissions in every review state: approved, rejected,
  and pending_review. The pending ones are left genuinely unreviewed
  (reviewed_by/reviewed_at NULL) so they show up in the admin review
  queue at GET /admin/heritage-submissions.

Idempotent on re-run for the user row itself (skips creation if the email
already exists) but always adds a fresh batch of registrations/submissions,
so don't run this twice unless you want duplicates.

Run from backend/: python -m db.seed_user2_history
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from psycopg2.extras import RealDictCursor

from database import pool
from utils.security import hash_password

USER2_EMAIL = "user2@example.com"
USER2_PASSWORD = "Password123!"
USER2_FULL_NAME = "User Two"
USER2_PHONE = "9876500002"

PAST_EVENT_COUNT = 3
REGISTRATION_STATUSES = ["confirmed", "cancelled", "confirmed"]

HERITAGE_SUBMISSIONS = [
    {
        "name": "Kasba Ganpati Wada (Seed)",
        "category": "built",
        "address": "Kasba Peth, Pune",
        "construction_period": "17th century",
        "historical_significance": "One of the oldest wadas in the Kasba Peth area, associated with early Peshwa-era administration.",
        "description": "A modest but well-preserved wada structure showing traditional wooden bracket work and an inner courtyard, typical of Pune's old-city residential architecture.",
        "status": "approved",
    },
    {
        "name": "Narayan Peth Stepwell (Seed)",
        "category": "built",
        "address": "Narayan Peth, Pune",
        "construction_period": "18th century",
        "historical_significance": "A neighborhood stepwell that historically served as a water source before municipal piped supply.",
        "description": "A stone stepwell with a descending staircase, currently disused but structurally intact.",
        "status": "approved",
    },
    {
        "name": "Random Concrete Shed (Seed)",
        "category": "built",
        "address": "Behind Swargate Bus Stand, Pune",
        "construction_period": "1990s",
        "historical_significance": "None - a modern utility shed mistakenly submitted as a heritage site.",
        "description": "A plain concrete storage shed with no architectural or historical value.",
        "status": "rejected",
    },
    {
        "name": "Sadashiv Peth Wada Ruins (Seed)",
        "category": "built",
        "address": "Sadashiv Peth, Pune",
        "construction_period": "Unknown, possibly 19th century",
        "historical_significance": "Partial wada remains, significance unverified.",
        "description": "Only the outer wall and a carved doorway survive; the rest of the structure has collapsed.",
        "status": "pending_review",
    },
    {
        "name": "Ganesh Peth Old Well (Seed)",
        "category": "built",
        "address": "Ganesh Peth, Pune",
        "construction_period": "Unknown",
        "historical_significance": "Local residents believe it predates the surrounding buildings, unconfirmed.",
        "description": "A brick-lined well set into a residential courtyard, still in occasional use.",
        "status": "pending_review",
    },
]

# Central Pune coordinates, jittered slightly per submission below.
BASE_LAT = 18.5195
BASE_LON = 73.8553

# (order_status, payment_status, days_ago) - each draws a different
# product so the three orders don't collide on the same item.
PAST_ORDERS = [
    ("delivered", "succeeded", 25),
    ("shipped", "succeeded", 10),
    ("cancelled", "refunded", 5),
]
ORDER_PRODUCT_COUNT = len(PAST_ORDERS)


def get_or_create_user2(conn) -> str:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (USER2_EMAIL,))
        existing = cur.fetchone()
        if existing:
            print(f"user2 already exists: {existing['id']}")
            return str(existing["id"])

        new_id = str(uuid4())
        cur.execute(
            """
            INSERT INTO users (id, email, password_hash, full_name, phone, is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, TRUE, now())
            RETURNING id
            """,
            (new_id, USER2_EMAIL, hash_password(USER2_PASSWORD), USER2_FULL_NAME, USER2_PHONE),
        )
        cur.execute(
            "INSERT INTO user_roles (user_id, role) VALUES (%s, 'registered_member')",
            (new_id,),
        )
    conn.commit()
    print(f"created user2: {new_id} (password: {USER2_PASSWORD})")
    return new_id


def get_admin_reviewer_id(conn) -> str | None:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT u.id FROM users u
            JOIN user_roles r ON r.user_id = u.id
            WHERE r.role = 'system_admin'
            LIMIT 1
            """
        )
        row = cur.fetchone()
        return str(row["id"]) if row else None


def seed_past_event_registrations(conn, user_id: str) -> int:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT id, title FROM events
            WHERE status = 'completed'
            ORDER BY event_date DESC
            LIMIT %s
            """,
            (PAST_EVENT_COUNT,),
        )
        past_events = cur.fetchall()

    if not past_events:
        print("No completed events found to register user2 for - skipping.")
        return 0

    count = 0
    with conn.cursor() as cur:
        for event, reg_status in zip(past_events, REGISTRATION_STATUSES):
            cur.execute(
                """
                INSERT INTO event_registrations (
                    id, event_id, user_id, status, first_name, last_name,
                    email, phone, attendee_count, registered_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 1, now())
                """,
                (
                    str(uuid4()),
                    event["id"],
                    user_id,
                    reg_status,
                    "User",
                    "Two",
                    USER2_EMAIL,
                    USER2_PHONE,
                ),
            )
            count += 1
            print(f"registered ({reg_status}) for past event: {event['title']!r}")
    conn.commit()
    return count


def seed_heritage_submissions(conn, user_id: str, reviewer_id: str | None) -> int:
    count = 0
    with conn.cursor() as cur:
        for i, sub in enumerate(HERITAGE_SUBMISSIONS):
            lat = BASE_LAT + (i * 0.004)
            lon = BASE_LON + (i * 0.004)
            is_reviewed = sub["status"] in ("approved", "rejected")

            cur.execute(
                """
                INSERT INTO heritage_sites (
                    id, name, category, location, address, construction_period,
                    historical_significance, description, status, submitted_by,
                    reviewed_by, reviewed_at, review_notes
                )
                VALUES (
                    %s, %s, %s,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s
                )
                """,
                (
                    str(uuid4()),
                    sub["name"],
                    sub["category"],
                    lon,
                    lat,
                    sub["address"],
                    sub["construction_period"],
                    sub["historical_significance"],
                    sub["description"],
                    sub["status"],
                    user_id,
                    reviewer_id if is_reviewed else None,
                    datetime.now(timezone.utc) if is_reviewed else None,
                    "Seed data - reviewed for demo purposes." if is_reviewed else None,
                ),
            )
            count += 1
            print(f"submission ({sub['status']}): {sub['name']!r}")
    conn.commit()
    return count


def seed_past_orders(conn, user_id: str) -> int:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT id, name, price_cents FROM products WHERE is_active = TRUE ORDER BY random() LIMIT %s",
            (ORDER_PRODUCT_COUNT,),
        )
        products = cur.fetchall()

    if len(products) < ORDER_PRODUCT_COUNT:
        print("Not enough active products to seed past orders - skipping.")
        return 0

    count = 0
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        for product, (order_status, payment_status, days_ago) in zip(products, PAST_ORDERS):
            placed_at = datetime.now(timezone.utc) - timedelta(days=days_ago)
            quantity = 1
            total_cents = product["price_cents"] * quantity

            payment_id = str(uuid4())
            cur.execute(
                """
                INSERT INTO payments (
                    id, payer_id, purpose, amount_cents, currency, status,
                    gateway_reference, created_at
                )
                VALUES (%s, %s, 'shop_order', %s, 'INR', %s, %s, %s)
                """,
                (
                    payment_id,
                    user_id,
                    total_cents,
                    payment_status,
                    f"SEED-{payment_id[:8]}",
                    placed_at,
                ),
            )

            order_id = str(uuid4())
            cur.execute(
                """
                INSERT INTO orders (
                    id, customer_id, status, total_cents, shipping_address,
                    payment_id, placed_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    order_id,
                    user_id,
                    order_status,
                    total_cents,
                    "123 Seed Street, Shivajinagar, Pune 411005",
                    payment_id,
                    placed_at,
                ),
            )

            cur.execute(
                """
                INSERT INTO order_items (id, order_id, product_id, quantity, unit_price_cents)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (str(uuid4()), order_id, product["id"], quantity, product["price_cents"]),
            )

            count += 1
            print(f"order ({order_status}/{payment_status}): {product['name']!r} x{quantity}")
    conn.commit()
    return count


def main() -> None:
    conn = pool.getconn()
    try:
        user_id = get_or_create_user2(conn)
        reviewer_id = get_admin_reviewer_id(conn)
        if reviewer_id is None:
            print("WARNING: no system_admin user found - approved/rejected rows will have reviewed_by=NULL")

        reg_count = seed_past_event_registrations(conn, user_id)
        sub_count = seed_heritage_submissions(conn, user_id, reviewer_id)
        order_count = seed_past_orders(conn, user_id)

        print("\n--- Summary ---")
        print(f"user2 id: {user_id}")
        print(f"Past event registrations created: {reg_count}")
        print(f"Heritage submissions created: {sub_count}")
        print(f"Past orders created: {order_count}")
    finally:
        pool.putconn(conn)


if __name__ == "__main__":
    main()
