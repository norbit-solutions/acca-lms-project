import AdminLayoutClient from "@/components/admin/layout/main/AdminLayoutClient";




export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return <AdminLayoutClient >{children}</AdminLayoutClient>;
}
