import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSocialConnectionsAction } from "@/app/actions/user";
import { SettingsClient } from "@/components/dashboard/settings/SettingsClient";

export const metadata = {
    title: "Settings | V Gen",
    description: "Manage your account settings and social profiles.",
};

export default async function SettingsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const initialConnections = await getSocialConnectionsAction();

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Manage your account and connected platforms.
                    </p>
                </div>
            </div>

            <SettingsClient initialConnections={initialConnections} />
        </div>
    );
}
