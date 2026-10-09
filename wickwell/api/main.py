"""
Lumé API — checkout + payments (+ Scent Finder).
Run:  pip install -r requirements.txt
      uvicorn main:app --reload --port 8000

The browser never decides prices or "paid" status. This service:
  1. re-prices the cart from the database,
  2. creates a pending order + a Razorpay order,
  3. marks it paid only after verifying Razorpay's signature (or webhook).
"""
import hashlib
import hmac
import os
import re

import razorpay
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from supabase import create_client

load_dotenv()

db = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
rzp = razorpay.Client(auth=(os.environ["RAZORPAY_KEY_ID"], os.environ["RAZORPAY_KEY_SECRET"]))

FREE_SHIPPING_ABOVE_PAISE = 99900  # keep in sync with lib/pricing.ts
SHIPPING_PAISE = 9900

app = FastAPI(title="Lumé API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ───────── Schemas ─────────
class Item(BaseModel):
    variant_id: str
    quantity: int = Field(ge=1, le=20)


class Address(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    phone: str
    line1: str = Field(min_length=3, max_length=200)
    line2: str | None = Field(default=None, max_length=200)
    city: str = Field(min_length=2, max_length=80)
    state: str = Field(min_length=2, max_length=80)
    pincode: str

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        if not re.fullmatch(r"[6-9][0-9]{9}", v):
            raise ValueError("Enter a valid 10-digit mobile number")
        return v

    @field_validator("pincode")
    @classmethod
    def _pin(cls, v: str) -> str:
        if not re.fullmatch(r"[1-9][0-9]{5}", v):
            raise ValueError("Enter a valid 6-digit pincode")
        return v


class OrderIn(BaseModel):
    email: str = Field(pattern=r"^\S+@\S+\.\S+$", max_length=200)
    items: list[Item] = Field(min_length=1, max_length=30)
    address: Address


class VerifyIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ───────── Helpers ─────────
def user_id_from_token(authorization: str | None) -> str | None:
    """Optional login: a valid Supabase access token links the order to the user."""
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    try:
        return db.auth.get_user(authorization.split(" ", 1)[1]).user.id
    except Exception:
        return None


def mark_paid(order: dict, payment_id: str) -> None:
    """Idempotent: safe to call from both /orders/verify and the webhook."""
    if order["status"] != "pending":
        return
    updated = (
        db.table("orders")
        .update({"status": "paid", "razorpay_payment_id": payment_id})
        .eq("id", order["id"]).eq("status", "pending")
        .execute().data
    )
    if not updated:  # another request won the race
        return
    for it in db.table("order_items").select("variant_id, quantity").eq("order_id", order["id"]).execute().data:
# ───────── Routes ─────────
        """WickWell API — checkout + payments (+ Scent Finder)."""
        import hashlib
        import hmac
        import os
        import re
@app.get("/health")
def health():
        app = FastAPI(title="WickWell API")


@app.post("/orders")
def create_order(body: OrderIn, authorization: str | None = Header(default=None)):
    # Merge duplicate variant lines, then price everything from the DB.
    qty: dict[str, int] = {}
    for i in body.items:
        qty[i.variant_id] = min(20, qty.get(i.variant_id, 0) + i.quantity)

    variants = (
        db.table("variants")
        .select("id, size_label, price_paise, stock, products(name, is_active)")
        .in_("id", list(qty))
        .execute().data
    )
    if len(variants) != len(qty):
        raise HTTPException(400, "Some items are no longer available. Please refresh your bag.")

    subtotal, lines = 0, []
    for v in variants:
        name = v["products"]["name"]
        if not v["products"]["is_active"]:
            raise HTTPException(400, f"{name} is no longer available.")
        if v["stock"] < qty[v["id"]]:
            raise HTTPException(400, f"Only {v['stock']} of {name} ({v['size_label']}) left in stock.")
        subtotal += v["price_paise"] * qty[v["id"]]
        lines.append((v, qty[v["id"]]))

    shipping = 0 if subtotal >= FREE_SHIPPING_ABOVE_PAISE else SHIPPING_PAISE
    total = subtotal + shipping

    order = (
        db.table("orders")
        .insert({
            "user_id": user_id_from_token(authorization),
            "email": body.email.lower(),
            "subtotal_paise": subtotal,
            "shipping_paise": shipping,
            "total_paise": total,
            "shipping_address": body.address.model_dump(),
        })
        .execute().data[0]
    )
    db.table("order_items").insert([
        {
            "order_id": order["id"], "variant_id": v["id"], "product_name": v["products"]["name"],
            "size_label": v["size_label"], "unit_price_paise": v["price_paise"], "quantity": q,
        }
        for v, q in lines
    ]).execute()

    try:
        r = rzp.order.create({
            "amount": total, "currency": "INR",
            "receipt": f"wickwell-{order['order_number']}",
            "notes": {"order_id": order["id"]},
        })
    except Exception:
        db.table("orders").update({"status": "cancelled"}).eq("id", order["id"]).execute()
        raise HTTPException(502, "Payment provider is unavailable. Please try again.")

    db.table("orders").update({"razorpay_order_id": r["id"]}).eq("id", order["id"]).execute()
    return {
        "order_id": order["id"],
        "order_number": order["order_number"],
        "razorpay_order_id": r["id"],
        "amount": total,
        "key_id": os.environ["RAZORPAY_KEY_ID"],
    }


@app.post("/orders/verify")
def verify(body: VerifyIn):
    try:
        rzp.utility.verify_payment_signature(body.model_dump())
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(400, "Payment signature invalid")

    rows = db.table("orders").select("*").eq("razorpay_order_id", body.razorpay_order_id).execute().data
    if not rows:
        raise HTTPException(404, "Order not found")
    mark_paid(rows[0], body.razorpay_payment_id)
    return {"ok": True, "order_number": rows[0]["order_number"]}


@app.post("/webhooks/razorpay")
async def webhook(request: Request, x_razorpay_signature: str = Header(default="")):
    """Safety net if the customer closes the tab right after paying.
    Dashboard → Webhooks → URL: https://<your-api>/webhooks/razorpay, event: payment.captured"""
    raw = await request.body()
    expected = hmac.new(os.environ["RAZORPAY_WEBHOOK_SECRET"].encode(), raw, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, x_razorpay_signature):
        raise HTTPException(400, "Bad signature")

    event = await request.json()
    if event.get("event") == "payment.captured":
        pay = event["payload"]["payment"]["entity"]
        rows = db.table("orders").select("*").eq("razorpay_order_id", pay["order_id"]).execute().data
        if rows:
            mark_paid(rows[0], pay["id"])
    return {"ok": True}