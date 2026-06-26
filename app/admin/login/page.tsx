import { redirect } from "next/navigation";

/**
 * There is one login for the whole site (see docs/ACCOUNT-MODEL.md): this legacy
 * admin URL just forwards to the unified login, which routes admins to /admin.
 */
export default function AdminLoginPage() {
  redirect(`/account/login?next=${encodeURIComponent("/admin")}`);
}
