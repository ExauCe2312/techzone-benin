import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getAllProductsForAdmin } from "@/lib/data";
import AdminLoginGate from "@/components/admin/login-gate";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await verifySessionToken(token);

  if (!authenticated) {
    return <AdminLoginGate />;
  }

  const products = await getAllProductsForAdmin();
  return <AdminDashboard initialProducts={products} />;
}
