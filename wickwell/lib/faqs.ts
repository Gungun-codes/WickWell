// FILE PATH: wickwell/lib/faqs.ts  (replace/create this file in your project)
import { SITE } from "./site";
import { FREE_SHIPPING_ABOVE_PAISE, SHIPPING_PAISE } from "./pricing";
import { rupees } from "./format";

export type Faq = { group: string; q: string; a: string };

export const FAQS: Faq[] = [
  // ───────── Ordering ─────────
  { group: "Ordering", q: "How do I place an order?",
    a: "Pick your candle, choose a size and add it to your bag. At checkout, enter your delivery details and pay online. You will see a confirmation page right away, and your order shows up under your account if you were signed in." },
  { group: "Ordering", q: "Do I need an account to order?",
    a: "No, you can check out as a guest. An account helps you see your past orders, and it is needed if you want to write a review, because only customers who bought a candle can review it." },
  { group: "Ordering", q: "Can I change or cancel my order?",
    a: `Yes, as long as it has not been dispatched and the request is made within ${SITE.returnWindowHours} hours of placing the order. Message us with your order number as soon as you can. Orders are dispatched within ${SITE.dispatchTime}, and once a parcel is with the courier it cannot be cancelled.` },
  { group: "Ordering", q: "Do you take custom or bulk orders?",
    a: "Yes. Gift hampers, wedding and return favours, festive gifting and corporate orders are all welcome. Tell us the quantity, the scents you like and the date you need them by, and we will share a quote." },

  // ───────── Shipping ─────────
  { group: "Shipping", q: "How long does delivery take?",
    a: `We dispatch within ${SITE.dispatchTime}. After that, delivery usually takes ${SITE.deliveryTime}, depending on your pincode. Festive seasons can add a day or two.` },
  { group: "Shipping", q: "What does shipping cost?",
    a: `Shipping is free on orders above ${rupees(FREE_SHIPPING_ABOVE_PAISE)}. Below that, it is a flat ${rupees(SHIPPING_PAISE)}. You can see the exact amount in your bag before you pay.` },
  { group: "Shipping", q: "Where do you deliver?",
    a: "We deliver across India to every pincode our courier partners serve. Very remote locations may take longer. We do not ship outside India at the moment." },
  { group: "Shipping", q: "How do I track my order?",
    a: "Once your order ships, we send you the courier name and tracking number. If you have not heard from us a few days after paying, write to us with your order number." },

  // ───────── Payments ─────────
  { group: "Payments", q: "Which payment methods can I use?",
    a: "UPI, debit and credit cards, netbanking and popular wallets. Payments are handled by Razorpay on a secure page." },
  { group: "Payments", q: "Is it safe to pay on your site?",
    a: "Yes. Your payment is processed by Razorpay. We never see or store your card or UPI details." },
  { group: "Payments", q: "Money was deducted but I did not get a confirmation. What now?",
    a: `This is rare, and it usually sorts itself out within 30 minutes. If it does not, send us your order number or the payment ID from your bank message. If the payment failed on our side, the money is returned to your account within ${SITE.refundTime}.` },

  // ───────── Returns & damages ─────────
  { group: "Returns & damages", q: "What if my candle arrives damaged or broken?",
    a: `We are sorry, and we will fix it. Message us within ${SITE.returnWindowHours} hours of delivery with your order number, a photo of the damage and, if you can, a short video of opening the parcel. We will send a replacement or refund you.` },
  { group: "Returns & damages", q: "Do you accept returns?",
    a: "Candles are made for you and cannot be re-sold once they leave us, so we do not accept returns for change of mind, or for candles that have been lit. Damaged, defective or wrong items are always replaced or refunded. The full details are on our Returns page." },
  { group: "Returns & damages", q: "How long does a refund take?",
    a: `Once we approve it, the money goes back to your original payment method within ${SITE.refundTime}. Your bank may take a little longer to show it.` },

  // ───────── Candle care & safety ─────────
  { group: "Candle care & safety", q: "How long will my candle burn?",
    a: "Burn time is on each product page, and it depends on the size you choose. Our 180 g candles are made to burn for up to around 50 hours when you follow the care tips below." },
  { group: "Candle care & safety", q: "How do I get the best burn and scent?",
    a: "On the first burn, let the wax melt all the way to the edge of the jar, which usually takes 2 to 3 hours. Trim the wick to about 5 mm before every burn. Do not burn for more than 4 hours at a stretch, and stop when about 1 cm of wax is left." },
  { group: "Candle care & safety", q: "Any safety tips?",
    a: "Never leave a burning candle unattended. Keep it away from children, pets, curtains and anything that can catch fire, and place it on a flat, heat-resistant surface. Put it out before sleeping or leaving the room." },
  { group: "Candle care & safety", q: "I have allergies or a sensitive nose. What should I do?",
    a: "The ingredients are listed on each product page. If you are sensitive to fragrances, check them first or write to us before ordering, and we will help you pick something gentler." },
];

export const FAQ_GROUPS = Array.from(new Set(FAQS.map((f) => f.group)));