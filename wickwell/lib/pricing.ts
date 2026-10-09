// Keep in sync with api/main.py (the server is the source of truth for charged amounts).
export const FREE_SHIPPING_ABOVE_PAISE = 99900; // ₹999
export const SHIPPING_PAISE = 9900;             // ₹99

export const shippingFor = (subtotalPaise: number) =>
  subtotalPaise === 0 || subtotalPaise >= FREE_SHIPPING_ABOVE_PAISE ? 0 : SHIPPING_PAISE;