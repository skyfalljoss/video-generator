
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white dark:bg-black min-h-screen">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
