import { permanentRedirect } from "next/navigation";

/** Short legacy alias for the submit side of the merged Letters portal. */
export default function LettersShortSubmitRedirect() {
  permanentRedirect("/letters?do=submit");
}
