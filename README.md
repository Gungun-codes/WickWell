# WickWell

## Local checkout

The storefront uses Next.js and the payment API is FastAPI. The API creates
Razorpay orders from server-priced cart data at `POST /orders`, verifies
payment signatures at `POST /orders/verify`, and also supports Razorpay
payment-captured webhooks at `POST /webhooks/razorpay`.

Razorpay credentials belong only in the API environment. Local test credentials
are in `wickwell/api/.env`, which is ignored by Git. The API also needs
`SUPABASE_SERVICE_ROLE_KEY` and either `SUPABASE_URL` or
`NEXT_PUBLIC_SUPABASE_URL`; the local API loads the ignored
`wickwell/.env.local` for these existing development settings. Never expose the
service-role key or Razorpay secret through a `NEXT_PUBLIC_` variable.

Install the Python API dependencies:

```bash
cd wickwell/api
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Start the API from `wickwell/api`:

```bash
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

In `wickwell/.env.local`, set `NEXT_PUBLIC_API_URL=http://localhost:8000` for
local checkout testing. In another terminal, start the storefront:

```bash
cd wickwell
npm install
npm run dev
```

Open the storefront, add an item to the cart, and submit checkout. Use Razorpay
test-mode payment details from the Razorpay Dashboard. A cancelled modal leaves
the cart unchanged; a successful payment is cleared only after the API confirms
its signature.