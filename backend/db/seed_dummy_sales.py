"""One-off seed script: inserts dummy `orders` + `payments` rows spread over
the last 6 months so `GET /admin/dashboard/sales-trend` has real data to
chart. Idempotent - re-running skips seeding if dummy rows already exist.

All seeded rows are tagged with shipping_address='DUMMY SEED DATA - safe to
delete' so they're easy to find and remove later:

    DELETE FROM orders WHERE shipping_address = 'DUMMY SEED DATA - safe to delete';
    DELETE FROM payments WHERE gateway_reference = 'dummy-seed';

Run from backend/: python -m db.seed_dummy_sales
"""

import random
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from psycopg2.extras import RealDictCursor

from database import pool

MARKER_ADDRESS = "DUMMY SEED DATA - safe to delete"
MONTHS_BACK = 6
ORDERS_PER_MONTH_RANGE = (4, 9)
ORDER_TOTAL_CENTS_RANGE = (25_000, 350_000)


def month_start(months_ago: int, now: datetime) -> datetime:
    year = now.year
    month = now.month - months_ago
    while month <= 0:
        month += 12
        year -= 1
    return now.replace(year=year, month=month, day=1, hour=0, minute=0, second=0, microsecond=0)


def main() -> None:
    conn = pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT count(*) AS n FROM orders WHERE shipping_address = %s",
                (MARKER_ADDRESS,),
            )
            if cur.fetchone()["n"] > 0:
                print("Dummy sales data already present - skipping seed.")
                return

            cur.execute("SELECT id FROM users LIMIT 20")
            user_ids = [row["id"] for row in cur.fetchall()]
            if not user_ids:
                print("No users found - cannot seed orders without a customer_id. Aborting.")
                return

            now = datetime.now(timezone.utc)
            inserted = 0

            for months_ago in range(MONTHS_BACK - 1, -1, -1):
                start = month_start(months_ago, now)
                next_month = month_start(months_ago - 1, now) if months_ago > 0 else now
                span_seconds = max(int((next_month - start).total_seconds()), 3600)

                for _ in range(random.randint(*ORDERS_PER_MONTH_RANGE)):
                    payer_id = random.choice(user_ids)
                    amount_cents = random.randint(*ORDER_TOTAL_CENTS_RANGE)
                    payment_id = str(uuid4())

                    cur.execute(
                        """
                        INSERT INTO payments
                            (id, payer_id, purpose, amount_cents, currency,
                             status, gateway_reference, created_at)
                        VALUES (%s, %s, 'shop_order', %s, 'INR',
                                'succeeded', 'dummy-seed', %s)
                        """,
                        (payment_id, payer_id, amount_cents, start),
                    )

                    placed_at = start + timedelta(seconds=random.randint(0, span_seconds - 1))
                    order_status = random.choice(["delivered", "delivered", "shipped", "paid"])

                    cur.execute(
                        """
                        INSERT INTO orders
                            (id, customer_id, status, total_cents,
                             shipping_address, payment_id, placed_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            str(uuid4()),
                            payer_id,
                            order_status,
                            amount_cents,
                            MARKER_ADDRESS,
                            payment_id,
                            placed_at,
                        ),
                    )
                    inserted += 1

        conn.commit()
        print(f"Seeded {inserted} dummy orders across the last {MONTHS_BACK} months.")
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)


if __name__ == "__main__":
    main()
