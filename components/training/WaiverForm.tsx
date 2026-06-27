"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { signWaiver } from "@/app/training/actions";
import { MEDIA_CONSENT_TEXT } from "@/content/consent";

const fieldBase =
  "w-full border-[1.5px] border-line bg-paper px-[16px] py-[12px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

/** True when the date of birth is less than 18 years before today. */
function isUnder18(dob: string): boolean {
  if (!dob) return false;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const beforeBirthday =
    now.getMonth() < born.getMonth() ||
    (now.getMonth() === born.getMonth() && now.getDate() < born.getDate());
  if (beforeBirthday) age -= 1;
  return age < 18;
}

export function WaiverForm({ next }: { next: string }) {
  const [dob, setDob] = useState("");
  const minor = isUnder18(dob);

  return (
    <form action={signWaiver} className="mt-7 grid gap-5">
      <input type="hidden" name="next" value={next} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="participant_name" className={labelBase}>
            Participant name
          </label>
          <input
            id="participant_name"
            name="participant_name"
            required
            className={fieldBase}
            placeholder="Who is training"
          />
        </div>
        <div>
          <label htmlFor="dob" className={labelBase}>
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={fieldBase}
          />
        </div>
      </div>

      {/* Only minors need a parent/guardian on the legal record. */}
      {minor && (
        <div>
          <label htmlFor="guardian_name" className={labelBase}>
            Parent / guardian name
          </label>
          <input
            id="guardian_name"
            name="guardian_name"
            required
            className={fieldBase}
            placeholder="Required for participants under 18"
          />
        </div>
      )}

      <label className="flex items-start gap-3 border border-line bg-paper-raised p-4">
        <input type="checkbox" name="media_consent" className="mt-1 h-4 w-4 flex-none accent-green" />
        <span className="text-[14px] text-muted">
          <strong className="font-bold text-ink">Optional media release.</strong>{" "}
          {MEDIA_CONSENT_TEXT.split("\n").slice(-1)[0]}
        </span>
      </label>

      <div>
        <label htmlFor="typed_name" className={labelBase}>
          Type your legal name to sign
        </label>
        <input
          id="typed_name"
          name="typed_name"
          required
          autoComplete="name"
          className={fieldBase}
          placeholder="Your full legal name"
        />
      </div>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 flex-none accent-red" />
        <span className="text-[14.5px] text-ink">
          I have read and agree to the liability waiver above, and I am the participant or their
          parent/legal guardian.
        </span>
      </label>

      <Button type="submit" variant="red">
        Sign &amp; continue
      </Button>
    </form>
  );
}
