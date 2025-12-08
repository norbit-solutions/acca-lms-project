import UsersClient from "@/components/admin/UsersClient";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(`${API_URL}/admin/users?page=1&limit=20`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
    const data = await res.json();
    const users = data?.data || data?.users || data || [];
    const meta = data?.meta || null;
    return <UsersClient initialUsers={users} initialMeta={meta} />;
  } catch {
    return <UsersClient initialUsers={[]} initialMeta={null} />;
  }
}
