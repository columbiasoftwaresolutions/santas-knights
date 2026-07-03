import { redirect } from "next/navigation";
import { TRAINING_HREF } from "@/content/site";

export default function TrainingRedirectPage() {
  redirect(TRAINING_HREF);
}
