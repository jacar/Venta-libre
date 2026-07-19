import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata = {
  title: 'Admin Dashboard - Tienda',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
