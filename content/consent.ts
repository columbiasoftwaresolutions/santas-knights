/**
 * Versioned consent / terms language for the Santa's Letters program.
 *
 * The full text of the version in force is stored alongside every acceptance
 * (consent_records.full_text), so this copy can evolve without losing what a
 * guardian actually agreed to. Bump the version whenever the text materially
 * changes. Final language is pending review; see REQUIREMENTS.md §3.1.
 */

export const GUARDIAN_CONSENT_VERSION = "2026-06-draft-3";

export const GUARDIAN_CONSENT_TEXT = `Santa's Letters Parent/Guardian Consent (version ${GUARDIAN_CONSENT_VERSION})

I confirm that I am the parent or legal guardian of the child named in this submission, and I am submitting this letter on their behalf.

I understand and agree that:

1. The child's first name, age, wish note, and an image of their handwritten letter may be displayed publicly on the Santa's Knights website so that donors can choose to send a gift. Santa's Knights will not publish last names, addresses, phone numbers, emails, school names, or social media handles, and I confirm the letter image I am uploading does not show any of these. Santa's Knights may remove any submission if needed.

2. Gifts are fulfilled by donors directly through Amazon. Santa's Knights does not handle payment, shipping, or guarantee that any letter receives a gift.

3. I will not use this platform to contact donors off-platform, and I understand donors are anonymous to families (and families to donors).

4. Santa's Knights, Inc. is not liable for the actions of donors or third parties (including Amazon) in connection with this program.

5. Santa's Knights may keep this submission and my acceptance of these terms on record.`;

export const DONOR_TERMS_VERSION = "2026-06-draft-2";

export const DONOR_TERMS_SUMMARY = `Gifts are fulfilled directly through Amazon. Santa's Knights never handles your payment. Do not attempt to identify, contact, or locate a child or family, scrape this site, or send anything that is not age-appropriate, legal, and safe.`;

/* ------------------------------------------------------------------ *
 * Gladiators NYC training tracker — liability waiver + media release.
 *
 * PLACEHOLDER LANGUAGE. Damion to provide the final waiver document before
 * public launch (see docs/GLADIATORS-SITE.md → Open Questions). The full text
 * of the version in force is stored on every signed `waivers` row, so this copy
 * can change without losing what a participant actually agreed to. Bump the
 * version string on any material change to force re-signing.
 * ------------------------------------------------------------------ */

export const LIABILITY_WAIVER_VERSION = "2026-06-draft-1";

export const LIABILITY_WAIVER_TEXT = `Gladiators NYC / Santa's Knights, Inc. — Liability Waiver & Assumption of Risk (version ${LIABILITY_WAIVER_VERSION})

PLACEHOLDER — final waiver language pending. Do not rely on this text for legal protection until it has been reviewed and replaced.

I understand that armored and martial-arts combat training is a physical, full-contact activity that carries an inherent risk of injury. In consideration of being allowed to participate in Gladiators NYC programs operated by Santa's Knights, Inc., I agree that:

1. I voluntarily assume all risks associated with participation, including the risk of serious injury.
2. I am physically able to participate, or have been cleared by a physician to do so.
3. I will follow all instructor directions and safety rules, and use protective equipment as required.
4. To the fullest extent permitted by law, I release Santa's Knights, Inc., its instructors, volunteers, and venue partners from liability for injury arising from ordinary negligence in the course of the activity.
5. If I am signing on behalf of a participant under 18, I am that participant's parent or legal guardian and I accept these terms on their behalf.

By typing my legal name and checking the box below, I acknowledge that I have read and agree to this waiver.`;

export const MEDIA_CONSENT_VERSION = "2026-06-draft-1";

export const MEDIA_CONSENT_TEXT = `Gladiators NYC / Santa's Knights, Inc. — Photo & Video Release (version ${MEDIA_CONSENT_VERSION})

This media release is OPTIONAL and separate from the liability waiver. Declining it does not affect your ability to train.

If granted, I permit Santa's Knights, Inc. to photograph and record me (or the minor participant I am responsible for) during classes and events, and to use those images and recordings for the nonprofit's marketing and outreach — including its website and social media (e.g. Instagram, Facebook, YouTube) — without compensation. I may withdraw this consent at any time by contacting Santa's Knights; withdrawal applies to future use.`;
