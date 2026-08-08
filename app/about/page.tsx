import { permanentRedirect } from "next/navigation";

/** Keep the former route working while /santas-knights remains canonical. */
export default function AboutRedirectPage() {
  permanentRedirect("/santas-knights");
}
