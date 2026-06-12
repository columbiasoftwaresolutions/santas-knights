/**
 * Versioned consent / terms language for the Santa's Letters program.
 *
 * The full text of the version in force is stored alongside every acceptance
 * (consent_records.full_text), so this copy can evolve without losing what a
 * guardian actually agreed to. Bump the version whenever the text materially
 * changes. Final language pending review — see REQUIREMENTS.md §3.1.
 */

export const GUARDIAN_CONSENT_VERSION = "2026-06-draft-1";

export const GUARDIAN_CONSENT_TEXT = `Santa's Letters — Parent/Guardian Consent (version ${GUARDIAN_CONSENT_VERSION})

I confirm that I am the parent or legal guardian of the child named in this submission, and I am submitting this letter on their behalf.

I understand and agree that:

1. The child's first name, age, wish note, and an image of their handwritten letter may be displayed publicly on the Santa's Knights website so that donors can choose to send a gift. Santa's Knights will not publish last names, addresses, phone numbers, emails, school names, or social media handles, and I confirm the letter image I am uploading does not show any of these. Santa's Knights may decline, edit-request, or remove any submission.

2. Gifts are fulfilled by donors directly through Amazon. Santa's Knights does not handle payment, shipping, or guarantee that any letter receives a gift.

3. I will not use this platform to contact donors off-platform, and I understand donors are anonymous to families (and families to donors).

4. Santa's Knights, Inc. is not liable for the actions of donors or third parties (including Amazon) in connection with this program.

5. Santa's Knights may keep this submission and my acceptance of these terms on record.`;

export const DONOR_TERMS_VERSION = "2026-06-draft-1";

export const DONOR_TERMS_SUMMARY = `Gifts are fulfilled directly through Amazon — Santa's Knights never handles your payment. Don't attempt to identify, contact, or locate a child or family, scrape this site, or send anything that isn't age-appropriate, legal, and safe.`;
