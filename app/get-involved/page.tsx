import { redirect } from "next/navigation";

/**
 * Get Involved was folded into /contact (one page: get in touch, ways to
 * help, and the volunteer application). This route stays for old links and
 * bookmarks.
 */
export default function GetInvolvedPage() {
  redirect("/contact");
}
