import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Santa's Knights account to submit and track letters.",
};

// Rendered by the shared (auth) layout's <AuthScene />; this route only
// needs to exist so /signup has its own metadata and URL.
export default function SignupPage() {
  return null;
}
