"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function NavbarSkeleton() {
    const [isScrolled, setIsScrolled] = useState(false)

    // Handle scroll effect for sticky behavior
    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        })
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
                isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm",
            )}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center justify-between w-full">
                    {/* Logo Skeleton - Left side */}
                    <div className="flex items-center">
                        <Skeleton className="h-8 w-32" />
                    </div>

                    {/* Categories Skeleton - Middle (hidden on mobile) */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-16" />
                        ))}
                    </nav>
                </div>

                {/* Right side - Cart Skeleton */}
                <div className="flex items-center gap-4">
                    {/* Cart Icon Skeleton */}
                    <Skeleton className="h-9 w-9 rounded-full" />

                    {/* Mobile Menu Skeleton */}
                    <Skeleton className="h-9 w-9 md:hidden" />
                </div>
            </div>
        </header>
    )
}
