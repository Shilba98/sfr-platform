import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[220px] min-h-screen">
        <div className="p-8 max-w-[1200px]">
          {children}
        </div>
      </main>
    </div>
  );
}
