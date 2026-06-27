import { permanentRedirect } from "next/navigation";

/** Short legacy alias for the merged Letters portal. */
export default function LettersShortGiveRedirect() {
  permanentRedirect("/letters");
}
