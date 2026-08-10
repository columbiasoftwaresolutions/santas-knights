import { redirect } from "next/navigation";

/**
 * Get Involved was folded into /contact: one page for getting in touch, the
 * three ways to help, and the volunteer application. This route stays for old
 * links and bookmarks, and lands on the application itself.
 */
export default function GetInvolvedPage() {
  redirect("/contact#volunteer");
}
