import { redirect } from "next/navigation";

/**
 * Submitting a letter now lives on the combined Letters page as its "submit"
 * side. This route is kept so old links and bookmarks land on that side.
 */
export default function SubmitLetterRedirect() {
  redirect("/letters/give?do=submit");
}
