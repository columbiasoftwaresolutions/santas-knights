import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In · Santa's Knights",
  description: "Sign in to your Santa's Knights account.",
};

// Rendered by the shared (auth) layout's <AuthScene />; this route only
// needs to exist so /login has its own metadata and URL.
export default function LoginPage() {
  return null;
}
