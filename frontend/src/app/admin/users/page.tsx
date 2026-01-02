import UsersClient from "@/components/admin/layout/main/UsersClient";
import { adminService } from "@/services/adminService";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { users, meta } = await adminService.getUsers({
    page: 1,
    limit: 20,
  });
  return <UsersClient initialUsers={users} initialMeta={meta} />;
}
