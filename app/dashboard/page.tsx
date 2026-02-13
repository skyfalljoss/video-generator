
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const recentProjects = [
    {
      id: 1,
      title: "How to Cook Pasta",
      status: "completed" as const,
      date: "2 hours ago",
      duration: "0:45",
      thumbnailUrl: "" // Add real images later
    },
    {
      id: 2,
      title: "Top 5 Travel Destinations 2024",
      status: "processing" as const,
      date: "5 hours ago",
      duration: "1:20",
      thumbnailUrl: ""
    },
    {
      id: 3,
      title: "Morning Yoga Routine",
      status: "draft" as const,
      date: "1 day ago",
      duration: "0:59",
      thumbnailUrl: ""
    },
     {
      id: 4,
      title: "Tech Gadget Review",
      status: "failed" as const,
      date: "2 days ago",
      duration: "0:30",
      thumbnailUrl: ""
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
           <p className="text-zinc-500 dark:text-zinc-400">Manage your projects and track progress.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Project
        </Button>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Projects</h2>
             <Button variant="link" className="text-indigo-600 dark:text-indigo-400">View All</Button>
        </div>
        
        {recentProjects.length > 0 ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recentProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        title={project.title}
                        status={project.status}
                        date={project.date}
                        duration={project.duration}
                        thumbnailUrl={project.thumbnailUrl}
                    />
                ))}
             </div>
        ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-zinc-500">No projects found. Start creating!</p>
            </div>
        )}
       
      </div>
    </div>
  );
}
