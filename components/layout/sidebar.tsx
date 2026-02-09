"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    LayoutDashboard,
    Users,
    GitFork,
    Calendar as CalendarIcon,
    TrendingUp,
    Folder,
    Settings,
    LogOut,
    User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Family Tree",
        href: "/dashboard/relationships",
        icon: Users,
    },
    {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: CalendarIcon,
    },
    {
        title: "Investments",
        href: "/dashboard/investments",
        icon: TrendingUp,
    },
    {
        title: "Documents",
        href: "/dashboard/vault",
        icon: Folder,
    },
    // Keeping these accessible but maybe less prominent or just in the list
    {
        title: "Members",
        href: "/dashboard/members",
        icon: User,
    },
    {
        title: "Events",
        href: "/dashboard/events",
        icon: CalendarIcon,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-64 border-r min-h-screen bg-background hidden md:flex">
            {/* Profile Section */}
            <div className="p-6 flex items-center gap-3 mb-6">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/01.png" alt="@miller" />
                    <AvatarFallback>MF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">The Miller Family</span>
                    <span className="text-xs text-muted-foreground">Premium Plan</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href)

                    return (
                        <Button
                            key={item.href}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start font-medium",
                                isActive
                                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-600" : "")} />
                                {item.title}
                            </Link>
                        </Button>
                    )
                })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 mt-auto space-y-1">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <LogOut className="mr-3 h-5 w-5" />
                    Log out
                </Button>
            </div>
        </div>
    )
}
