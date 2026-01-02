import { notFound } from "next/navigation";
import UserDetailClient from "@/components/admin/layout/main/UserDetailClient";
import { adminService } from "@/services/adminService";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    notFound();
  }

  try {
    const user = await adminService.getUser(userId);
    if (!user) {
      notFound();
    }
    return <UserDetailClient initialUser={user} />;
  } catch {
    notFound();
  }
}
