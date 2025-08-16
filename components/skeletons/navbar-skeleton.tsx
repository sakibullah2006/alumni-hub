import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
    return (
        <section className="py-4 px-2">
            <div className="container">
                {/* Desktop Skeleton */}
                <nav className="hidden justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        {/* Logo Skeleton */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <Skeleton className="h-6 w-24 bg-gray-300 dark:bg-gray-700" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-6 w-16 bg-gray-300 dark:bg-gray-700" />
                            <Skeleton className="h-6 w-16 bg-gray-300 dark:bg-gray-700" />
                            <Skeleton className="h-6 w-16 bg-gray-300 dark:bg-gray-700" />
                            <Skeleton className="h-6 w-16 bg-gray-300 dark:bg-gray-700" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-20 bg-gray-300 dark:bg-gray-700" />
                        <Skeleton className="h-9 w-20 bg-gray-300 dark:bg-gray-700" />
                    </div>
                </nav>

                {/* Mobile Skeleton */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        {/* Logo Skeleton */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <Skeleton className="h-6 w-24 bg-gray-300 dark:bg-gray-700" />
                        </div>
                        <Skeleton className="h-9 w-9 bg-gray-300 dark:bg-gray-700" />
                    </div>
                </div>
            </div>
        </section>
    );
}
