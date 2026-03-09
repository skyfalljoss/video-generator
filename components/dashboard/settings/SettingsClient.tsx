"use client";

import { useState, useTransition, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { SocialConnection, deleteAccountAction, disconnectSocialAction } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Youtube, Instagram, Music2, AlertTriangle, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { PlanUpgradeDialog } from "../PlanUpgradeDialog";

interface SettingsClientProps {
    initialConnections: SocialConnection[];
}

export function SettingsClient({ initialConnections }: SettingsClientProps) {
    const { signOut } = useClerk();
    const router = useRouter();
    
    const [connections, setConnections] = useState<SocialConnection[]>(initialConnections);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();

    const [tier, setTier] = useState<string>("free");
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState("");

    useEffect(() => {
        fetch("/api/user/tier")
            .then(res => res.json())
            .then(data => {
                if (data.tier) setTier(data.tier)
            })
            .catch(err => console.error("Failed to fetch tier", err))
    }, [])

    useEffect(() => {
        const error = searchParams.get("error");
        const success = searchParams.get("success");

        if (error) {
            toast.error(`Connection failed: ${error}`);
            // Clean up the URL
            router.replace("/dashboard/settings");
        } else if (success) {
            toast.success(`Successfully connected to ${success}!`);
            router.replace("/dashboard/settings");
        }
    }, [searchParams, router]);

    const handleConnect = (platform: "youtube" | "instagram" | "tiktok") => {
        // Enforce premium plan restrictions
        const isPremiumPlatform = ["tiktok", "instagram"].includes(platform);
        
        if (isPremiumPlatform && tier !== "unlimited") {
            setUpgradeMessage(`Connecting to ${platform} requires the Unlimited plan.`);
            setShowUpgradeDialog(true);
            return;
        }

        // Redirect to our new OAuth route handlers using router
        router.push(`/api/auth/${platform}`);
    };

    const handleDisconnect = (id: string, platform: string) => {
        startTransition(async () => {
            const result = await disconnectSocialAction(id);
            if (result.success) {
                toast.success(`Successfully disconnected ${platform}`);
                setConnections(prev => prev.filter(c => c.id !== id));
                router.refresh();
            } else {
                toast.error(result.error || `Failed to disconnect ${platform}`);
            }
        });
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteAccountAction();
            if (result.success) {
                toast.success("Account successfully deleted");
                await signOut(() => router.push("/"));
            } else {
                toast.error(result.error || "Failed to delete account");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
            setIsDeleting(false);
        }
    };

    const platforms = [
        { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500" },
        { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600" },
        { id: "tiktok", name: "TikTok", icon: Music2, color: "text-zinc-900 dark:text-white" },
    ] as const;

    return (
        <div className="space-y-6 max-w-4xl">
            <PlanUpgradeDialog 
                isOpen={showUpgradeDialog} 
                onOpenChange={setShowUpgradeDialog} 
                description={upgradeMessage} 
            />
            {/* Social Accounts Section */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">Social Media Accounts</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Connect your social accounts to automatically publish your generated videos.
                    </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                    {platforms.map((platform) => {
                        const connection = connections.find(c => c.platform === platform.id);
                        const isPremiumPlatform = ["tiktok", "instagram"].includes(platform.id);
                        const isLocked = isPremiumPlatform && tier !== "unlimited";
                        
                        return (
                            <Card key={platform.id} className={`border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden relative transition-all hover:border-indigo-500/50 ${isLocked ? "opacity-75 grayscale-[0.5]" : ""}`}>
                                {isLocked && !connection && (
                                     <div className="absolute top-3 right-3">
                                         <Lock className="h-4 w-4 text-zinc-400" />
                                     </div>
                                )}
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className={`p-4 rounded-full bg-zinc-50 dark:bg-zinc-800/50 ${platform.color}`}>
                                            <platform.icon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold">{platform.name}</CardTitle>
                                            {connection ? (
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                                    @{(connection.username || "user")}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                                    Not connected
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="w-full pt-4">
                                            {connection ? (
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800" 
                                                    disabled={isPending}
                                                    onClick={() => handleDisconnect(connection.id, platform.id)}
                                                >
                                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Disconnect"}
                                                </Button>
                                            ) : (
                                                <Button 
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                                    disabled={isPending}
                                                    onClick={() => handleConnect(platform.id)}
                                                >
                                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Connect"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Danger Zone Section */}
            <div className="space-y-4 pt-10">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h2 className="text-xl font-semibold tracking-tight text-red-500">Danger Zone</h2>
                </div>
                
                
                <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 max-w-2xl">
                    <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base text-red-700 dark:text-red-400">Delete Account</CardTitle>
                                <CardDescription className="text-red-600/80 dark:text-red-200/60 mt-1 text-xs">
                                    Permanently delete your user data, generated videos, and all connected projects.
                                </CardDescription>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap">
                                        Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="border-red-200 dark:border-red-900">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-red-600 dark:text-red-500">Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                        <Button 
                                            variant="destructive" 
                                            onClick={handleDeleteAccount} 
                                            disabled={isDeleting}
                                            className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
                                        >
                                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Account"}
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
