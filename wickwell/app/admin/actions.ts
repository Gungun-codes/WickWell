// FILE PATH: wickwell/app/admin/actions.ts  (replace/create this file in your project)
"use server";
import { revalidatePath } from "next/cache";

/** Clears the cached storefront so edits show up immediately instead of after the 5-minute refresh. */
export async function revalidateStore() {
  revalidatePath("/", "layout");
}