import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScene } from "@/components/account/AuthScene";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AuthScene />
      </Suspense>
      {children}
    </>
  );
}
