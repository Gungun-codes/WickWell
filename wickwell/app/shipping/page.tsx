// FILE PATH: wickwell/app/shipping/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { InfoPage, type Block } from "@/components/InfoPage";
import { SITE } from "@/lib/site";
import { FREE_SHIPPING_ABOVE_PAISE, SHIPPING_PAISE } from "@/lib/pricing";
import { rupees } from "@/lib/format";

export const metadata: Metadata = { title: "Shipping & delivery", description: "Shipping charges, dispatch and delivery times for WickWell orders." };

const blocks: Block[] = [
  { h: "Where we deliver",
    p: ["We deliver across India to every pincode our courier partners serve. Very remote areas can take longer. We do not ship outside India at the moment."] },
  { h: "Shipping charges",
    ul: [
      `Orders above ${rupees(FREE_SHIPPING_ABOVE_PAISE)}: free shipping.`,
      `Orders of ${rupees(FREE_SHIPPING_ABOVE_PAISE)} or below: a flat ${rupees(SHIPPING_PAISE)}.`,
    ],
    p: ["The exact amount is shown in your bag and at checkout before you pay. There are no surprise charges after that."] },
  { h: "Dispatch and delivery time",
    ul: [
      `Dispatch: within ${SITE.dispatchTime} of your order being confirmed.`,
      `Delivery: usually ${SITE.deliveryTime} after dispatch, depending on your pincode.`,
    ],
    p: ["Festive seasons, sales and bad weather can add a day or two. If your order is going to be late, we will let you know."] },
  { h: "Tracking your order",
    p: ["When your order ships, we share the courier name and tracking number with you. Use it on the courier\u2019s website to follow your parcel."] },
  { h: "Packaging",
    p: ["Candles are wrapped and packed to survive the journey. Please open the parcel with care, and record a short video while opening it if you can. It makes any damage claim quick and easy."] },
  { h: "Wrong address or missed delivery",
    p: [
      "Please check your address and phone number before paying, because couriers need a reachable number to deliver.",
      "If a delivery fails because of a wrong address or because no one was reachable, the parcel returns to us. We can send it again, and the extra shipping would be charged to you.",
    ] },
  { h: "Lost or delayed parcels",
    p: ["If your parcel has not arrived well past the expected date, write to us with your order number. We will chase the courier, and if it is lost we will send a replacement or refund you."] },
];

export default function ShippingPage() {
  return (
    <InfoPage
      title="Shipping & delivery"
      intro="Pan-India delivery, with the cost and timing laid out plainly."
      highlights={[
        { t: `Free above ${rupees(FREE_SHIPPING_ABOVE_PAISE)}`, d: `otherwise a flat ${rupees(SHIPPING_PAISE)}` },
        { t: SITE.dispatchTime, d: "to dispatch your order" },
        { t: SITE.deliveryTime, d: "typical delivery after dispatch" },
      ]}
      blocks={blocks}
    />
  );
}