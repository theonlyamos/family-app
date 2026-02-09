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
        <div className="flex flex-col w-64 border-r border-border min-h-screen bg-sidebar hidden md:flex transition-all duration-300">
            {/* Profile Section */}
            <div className="p-6 flex items-center gap-3 mb-6">
                <Avatar className="h-11 w-11 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all duration-300">
                    <AvatarImage src="/avatars/01.png" alt="@miller" />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">MF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-tight">The Miller Family</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-gentle-pulse"></span>
                        Premium Plan
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {sidebarItems.map((item, index) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href)

                    return (
                        <Button
                            key={item.href}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start font-medium rounded-xl transition-all duration-200 ease-out group",
                                "relative overflow-hidden",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 shadow-sm"
                                    : "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                            )}
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                            asChild
                        >
                            <Link href={item.href} className="relative">
                                {/* Active indicator bar */}
                                <span 
                                    className={cn(
                                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full bg-sidebar-primary transition-all duration-300",
                                        isActive ? "h-6 opacity-100" : "h-0 opacity-0"
                                    )}
                                />
                                <item.icon 
                                    className={cn(
                                        "mr-3 h-5 w-5 transition-all duration-200",
                                        isActive 
                                            ? "text-sidebar-primary" 
                                            : "text-sidebar-foreground group-hover:text-sidebar-foreground"
                                    )} 
                                />
                                <span className="relative z-10">{item.title}</span>
                            </Link>
                        </Button>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-3 mt-auto space-y-1 border-t border-sidebar-border bg-sidebar/50">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl transition-all duration-200"
                >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </Button>
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sidebar-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log out
                </Button>
            </div>
        </div>
    )
}
