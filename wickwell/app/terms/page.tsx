// FILE PATH: wickwell/app/terms/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { InfoPage, type Block } from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & conditions", description: "The terms that apply when you browse or buy from WickWell." };

const blocks: Block[] = [
  { h: "About these terms",
    p: [
      `These terms apply to your use of this website and to any order you place with ${SITE.name}${SITE.legalName !== SITE.name ? ` (operated by ${SITE.legalName})` : ""}. By using the site or placing an order, you agree to them. If you do not agree, please do not use the site.`,
    ] },
  { h: "Who we are",
    p: [
      `${SITE.name} sells hand-poured candles online.`,
      ...(SITE.address ? [`Address: ${SITE.address}.`] : []),
      `Email: ${SITE.email}.${SITE.phone ? ` Phone: ${SITE.phone}.` : ""}`,
    ] },
  { h: "Using the website",
    p: ["Please use the site only for lawful purposes. Do not try to break, overload or misuse it, and do not use it to post anything unlawful, abusive or misleading."] },
  { h: "Products and descriptions",
    p: [
      "We take care to describe and photograph every candle accurately. Because candles are poured by hand, there can be small natural differences in colour, surface and finish from one candle to the next. Screens also show colours differently.",
      "Burn times and scent strength are guides. They depend on the room, drafts and how you care for the candle.",
    ] },
  { h: "Prices and payment",
    ul: [
      "All prices are in Indian Rupees (INR).",
      "The price you see when you pay is the price you are charged, along with any shipping shown at checkout.",
      "Payments are processed securely by Razorpay. We do not see or store your card or UPI details.",
      "If we spot a pricing mistake, we may cancel the affected order and refund you in full.",
    ] },
  { h: "Orders and cancellation",
    p: [
      "Your order is confirmed once your payment succeeds. We may decline or cancel an order, for example if an item is out of stock or we cannot deliver to your pincode, and we will refund you in full if so.",
      "You can cancel before dispatch. See our Returns, refunds and cancellations page for the details.",
    ] },
  { h: "Shipping, returns and refunds",
    p: ["Our Shipping and Returns pages form part of these terms. Please read them before you order."] },
  { h: "Candle safety",
    p: [
      "Candles carry a naked flame. Never leave a burning candle unattended, keep it away from children, pets and flammable things, and burn it on a flat, heat-resistant surface. Follow the care tips on our FAQs page.",
      "We are not responsible for harm caused by use that goes against these instructions.",
    ] },
  { h: "Accounts and reviews",
    ul: [
      "You are responsible for keeping your login details safe.",
      "Only customers who have bought a candle can review it. Reviews must be honest and about your own experience.",
      "We may remove reviews that are abusive, unlawful, spam or off-topic.",
    ] },
  { h: "Our content",
    p: ["The logo, text, photos and designs on this site belong to us or are used with permission. Please do not copy or reuse them for commercial purposes without asking us first."] },
  { h: "Limits on our liability",
    p: ["To the extent the law allows, we are not liable for indirect or consequential losses, or for delays caused by couriers, weather or events outside our control. Nothing here limits your rights under Indian consumer law, or our liability where the law does not allow it to be limited."] },
  { h: "Governing law",
    p: [`These terms are governed by the laws of India. Any dispute is subject to the courts at ${SITE.city || "our registered place of business"}.`] },
  { h: "Grievance officer",
    p: [
      "If you have a complaint, please contact our grievance officer. We will acknowledge it within 48 hours and aim to resolve it within one month.",
      ...(SITE.grievance.name ? [`Name: ${SITE.grievance.name}`] : []),
      `Email: ${SITE.grievance.email || SITE.email}`,
      ...(SITE.grievance.phone ? [`Phone: ${SITE.grievance.phone}`] : []),
    ] },
  { h: "Changes to these terms",
    p: ["We may update these terms from time to time. The date at the top shows when they were last changed. Orders you have already placed are covered by the terms in force when you ordered."] },
];

export default function TermsPage() {
  return <InfoPage title="Terms & conditions" intro="The simple, fair ground rules for using our site and buying from us." blocks={blocks} numbered />;
}