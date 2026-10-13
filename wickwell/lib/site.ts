// FILE PATH: wickwell/lib/site.ts  (replace/create this file in your project)
/**
 * ONE place for your business details. Every info page (FAQs, Terms, Returns, Shipping, Contact,
 * Footer, WhatsApp button) reads from here. Anything left as "" is simply hidden on the site,
 * so nothing shows up broken. Fill these in before you launch.
 */
export const SITE = {
  name: "WickWell",
  tagline: "Hand-poured candles for every mood",

  // Who you are (needed on Terms / Contact pages under Indian e-commerce rules)
  legalName: "WickWell",          // your registered business or proprietor name
  email: "wickwell1210@gmail.com",
  phone: "",                       // e.g. "+91 98765 43210"
  whatsapp: "",                    // digits only with country code, e.g. "919876543210"
  instagram: "",                   // just the handle, e.g. "wickwell.in"
  city: "",                        // e.g. "Meerut, Uttar Pradesh"
  address: "",                     // full address (shown on Contact and Terms)
  supportHours: "Mon–Sat, 10 am – 7 pm IST",

  // Operations (the policies quote these, so keep them true)
  dispatchTime: "2–3 working days",
  deliveryTime: "3–7 working days",
  returnWindowHours: 24,
  refundTime: "5–7 working days",

  // Required by the Consumer Protection (E-Commerce) Rules, 2020
  grievance: { name: "", email: "", phone: "" },

  // "Meet the maker" block on Our Story. Hidden until you fill in a name.
  founder: { name: "", role: "Founder", story: [] as string[] },

  lastUpdated: "October 2026",
};

const digits = SITE.whatsapp.replace(/\D/g, "");

/** Returns a wa.me link, or null if no WhatsApp number is set. */
export function whatsappLink(text = "Hi WickWell! I have a question.") {
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}

export const instagramLink = SITE.instagram ? `https://www.instagram.com/${SITE.instagram.replace(/^@/, "")}` : null;