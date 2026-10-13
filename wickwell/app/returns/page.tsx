// FILE PATH: wickwell/app/returns/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { InfoPage, type Block } from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Returns, refunds & cancellations", description: "How WickWell handles damaged items, replacements, refunds and order cancellations." };

const blocks: Block[] = [
  { h: "Our promise",
    p: [`Every candle is packed with care. If something reaches you damaged, defective or not what you ordered, we will make it right with a replacement or a refund, at no cost to you.`] },
  { h: "What we replace or refund",
    ul: [
      "A candle or jar that arrives broken, cracked or leaking.",
      "A defective candle, for example a wick that will not stay lit when used as directed.",
      "A wrong item, size or scent sent to you by mistake.",
      "A parcel that is lost in transit.",
    ] },
  { h: "What we cannot take back",
    p: ["Candles are consumable and cannot be re-sold once they leave us, so we are not able to accept:"],
    ul: [
      "Returns for change of mind, or because you did not like the scent.",
      "Candles that have been lit or used.",
      "Damage caused after delivery, such as a drop, heat or wrong storage.",
      "Personalised or custom-made items, unless they arrive damaged or wrong.",
    ],
    note: "Not sure about a scent? Write to us before you order and we will help you choose." },
  { h: "How to raise a claim",
    p: [`Please contact us within ${SITE.returnWindowHours} hours of delivery.`],
    ul: [
      "Send your order number and the email or phone number you used.",
      "Attach clear photos of the item and the outer box, and a short unboxing video if you have one.",
      "Tell us briefly what went wrong.",
    ],
  },
  { h: "What happens next",
    p: [
      "We review your claim, usually within 1 to 2 working days, and tell you whether we will replace the item or refund you.",
      "For a replacement, we will arrange it at our cost. We may ask you to keep the damaged item until the replacement is on its way.",
    ] },
  { h: "Refunds",
    p: [
      `Approved refunds go back to the original payment method (UPI, card, netbanking or wallet) within ${SITE.refundTime}. Your bank or wallet may take a few extra days to show it.`,
      "If an item is out of stock when you ask for a replacement, we will refund you instead.",
    ] },
  { h: "Cancelling an order",
    ul: [
      `Before dispatch (usually within ${SITE.dispatchTime} of ordering) and within ${SITE.returnWindowHours} hours of placing the order: message us with your order number and we will cancel it and refund you in full.`,
      "After dispatch: we cannot cancel, because the parcel is already with the courier. You can refuse delivery, and we will help sort out a refund once it comes back to us.",
    ] },
  { h: "Failed or double payments",
    p: [`If money was deducted but the order did not go through, or you were charged twice, it is refunded automatically to your account within ${SITE.refundTime}. If it is not, write to us with the payment ID.`] },
];

export default function ReturnsPage() {
  return (
    <InfoPage
      title="Returns, refunds & cancellations"
      intro="Clear and fair, so you know exactly where you stand before you order."
      highlights={[
        { t: `${SITE.returnWindowHours} hours`, d: "to report damage after delivery" },
        { t: "Free fix", d: "replacement or refund for damaged or wrong items" },
        { t: SITE.refundTime, d: "for refunds to reach your account" },
      ]}
      blocks={blocks}
    />
  );
}