import { PricingTable } from "@clerk/nextjs";

export default function BillingPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 relative min-h-screen pb-20">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Billing &amp; Plans</h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Manage your subscription, view payment history, and upgrade your plan to unlock more video generations.
            </p>

            <div className="pt-2">
                <div className="mx-auto w-full max-w-6xl">
                    <PricingTable 
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "w-full max-w-none shadow-sm",
                                pricingTable: "grid w-full grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl", 
                                planTier: "h-full w-full",
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
