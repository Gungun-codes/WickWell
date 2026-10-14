// FILE PATH: wickwell/lib/story.ts  (replace/create this file in your project)
/**
 * Content for the Our Story page. (Your name, role and story paragraphs live in SITE.founder in lib/site.ts.)
 * Anything left empty is simply hidden.
 */
export const STORY = {
  photo: "/founder.jpeg",              // main photo, put the file in the /public folder
  photoAlt: "",                        // describe the photo, e.g. "Priya pouring a candle". Empty = uses the founder name
  photo2: "",                          // optional second photo, e.g. "/founder-2.jpeg" (small photo overlapping the frame)
  caption: "Hand-poured with love",    // small label on the photo. "" hides it

  // The meaning of your brand name, in one line. Shown in italics under the heading. "" hides it.
  // Example: 'WickWell: a wick that burns well, and a space that feels well.'
  nameMeaning: "",

  // Facts shown as big numbers. Only put TRUE things here. Add real numbers when you have them,
  // e.g. { value: "500+", label: "Happy customers" }
  stats: [{ value: "100%", label: "Hand-poured" }],

  // Also show live counts from your store ("Candles", "Categories"). They update as you add products.
  showLiveCounts: true,
};