
import { SeriesList } from "@/components/dashboard/SeriesList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Series } from "@/components/dashboard/SeriesCard";

// Use Service Role Key for Admin Access - bypasses RLS for reading user data securely on the server
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey);
}

export default async function DashboardPage() {
    const { userId } = await auth();
    
    // Default empty if not logged in (should be handled by middleware mostly)
    let series: Series[] = [];

    if (userId) {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("series_projects")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        
        if (!error && data) {
            series = data as Series[];
        } else if (error) {
            console.error("Error fetching series:", error);
        }
    }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
           <p className="text-zinc-500 dark:text-zinc-400">Manage your projects and track progress.</p>
        </div>
        <Link href="/dashboard/create-series">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Project
            </Button>
        </Link>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Projects</h2>
        </div>
        
        <SeriesList initialSeries={series} />
       
      </div>
    </div>
  );
}
