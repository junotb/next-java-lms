import AdminHeader from "@/component/admin/Header";
import AdminFooter from "@/component/admin/Footer";
//

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <AdminFooter />
    </div>
  );
}