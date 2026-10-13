// FILE PATH: wickwell/app/privacy/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { InfoPage, type Block } from "@/components/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy", description: "What personal information WickWell collects, why, and how it is protected." };

const blocks: Block[] = [
  { h: "The short version",
    p: ["We collect only what we need to take and deliver your order and to run the store. We do not sell your personal information."] },
  { h: "What we collect",
    ul: [
      "Details you give us: name, email, phone number and delivery address when you check out or create an account.",
      "Order details: what you bought, when, and how much you paid.",
      "Reviews you write and messages you send us.",
      "Your newsletter email, if you subscribe.",
      "Basic technical data such as your browser and device, which helps keep the site working and secure.",
    ],
    note: "We never see or store your card, UPI PIN or netbanking details. Those go directly to our payment partner, Razorpay." },
  { h: "How we use it",
    ul: [
      "To process, ship and support your orders.",
      "To send order updates, and marketing emails only if you subscribed (you can unsubscribe at any time).",
      "To prevent fraud and keep the site safe.",
      "To improve our products and the website.",
      "To meet legal and tax obligations.",
    ] },
  { h: "Who we share it with",
    p: ["Only the services that help us run the store, and only what they need:"],
    ul: [
      "Razorpay, to take payments.",
      "Courier partners, to deliver your parcel (name, address, phone).",
      "Supabase, which securely stores our database and logins.",
      "Cloudinary and Vercel, which host our images and website.",
      "Authorities, if the law requires it.",
    ] },
  { h: "Cookies and similar storage",
    p: ["We store your bag in your browser so it is still there when you come back, and we use a login session if you sign in. These are needed for the site to work. We do not use them to follow you around the web."] },
  { h: "How long we keep it",
    p: ["We keep order records for as long as the law requires for accounts and tax, and other information only as long as we need it. You can ask us to delete your account at any time."] },
  { h: "Your choices",
    ul: [
      "Ask to see the information we hold about you.",
      "Ask us to correct anything that is wrong.",
      "Ask us to delete your account and information, except what we must keep by law.",
      "Unsubscribe from marketing emails using the link in any email.",
    ],
    p: [`To do any of this, email ${SITE.email}.`] },
  { h: "Keeping your data safe",
    p: ["We use secure connections and access controls to protect your information. No system is perfect, but we take reasonable care and limit who can see your data."] },
  { h: "Children",
    p: ["Our site is meant for adults. We do not knowingly collect information from children."] },
  { h: "Changes to this policy",
    p: ["If we change how we handle your information, we will update this page and the date at the top."] },
  { h: "Contact",
    p: [`Questions about your privacy? Email ${SITE.grievance.email || SITE.email}.`] },
];

export default function PrivacyPage() {
  return <InfoPage title="Privacy policy" intro="What we collect, why we collect it, and the choices you have." blocks={blocks} numbered />;
}