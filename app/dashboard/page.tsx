"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function DashboardPage() {
    const members = useQuery(api.members.list)
    const events = useQuery(api.events.list)
    const investments = useQuery(api.investments.list)
    const activities = useQuery(api.activities.list)

    const isLoading = members === undefined || events === undefined || investments === undefined || activities === undefined

    const totalValue = (investments ?? []).reduce((acc, curr) => acc + curr.amount, 0)
    const memberCount = (members ?? []).length
    const eventCount = (events ?? []).length
    const nextEvent = (events ?? [])
        .filter(e => new Date(e.startTime) > new Date())
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] || null

    const stats: Array<{
        title: string
        value: string
        change: string
        trend: "up" | "down" | "neutral"
        icon: typeof Users
        iconBg: string
        iconColor: string
    }> = [
            {
                title: "Total Members",
                value: isLoading ? "..." : `${memberCount}`,
                change: `${memberCount} registered`,
                trend: "neutral" as const,
                icon: Users,
                iconBg: "bg-[oklch(0.94_0.02_145)]",
                iconColor: "text-[oklch(0.35_0.06_145)]"
            },
            {
                title: "Upcoming Events",
                value: isLoading ? "..." : `${eventCount}`,
                change: nextEvent ? `Next: ${nextEvent.title}` : "No upcoming events",
                trend: "neutral" as const,
                icon: Calendar,
                iconBg: "bg-[oklch(0.94_0.06_45)]",
                iconColor: "text-[oklch(0.45_0.12_45)]"
            },
            {
                title: "Total Investments",
                value: isLoading ? "..." : `$${totalValue.toLocaleString()}`,
                change: `${(investments ?? []).length} holdings`,
                trend: "neutral" as const,
                icon: TrendingUp,
                iconBg: "bg-[oklch(0.95_0.04_85)]",
                iconColor: "text-[oklch(0.40_0.08_85)]"
            },
            {
                title: "Recent Activities",
                value: isLoading ? "..." : `${(activities ?? []).length}`,
                change: "Tracked events",
                trend: "neutral" as const,
                icon: Activity,
                iconBg: "bg-[oklch(0.94_0.02_250)]",
                iconColor: "text-[oklch(0.35_0.06_250)]"
            }
        ]

    // Format relative time from Convex creation time
    const formatRelativeTime = (creationTime: number): string => {
        const diff = Date.now() - creationTime
        const minutes = Math.floor(diff / 60000)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        if (days < 7) return `${days}d ago`
        return `${Math.floor(days / 7)}w ago`
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-display font-medium tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's what's happening with your family.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-display font-medium tracking-tight mb-1">
                                {stat.value}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                                {stat.trend === "up" && (
                                    <span className="flex items-center text-primary font-medium">
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    </span>
                                )}
                                {stat.trend === "down" && (
                                    <span className="flex items-center text-destructive font-medium">
                                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    </span>
                                )}
                                <span className="text-muted-foreground">
                                    {stat.change}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(activities ?? []).length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No recent activity. Seed the database to get started!</p>
                            ) : (
                                (activities ?? []).map((activity) => (
                                    <div key={activity._id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === "member" ? "bg-[oklch(0.94_0.02_145)] text-[oklch(0.35_0.06_145)]" :
                                            activity.type === "document" ? "bg-[oklch(0.94_0.02_250)] text-[oklch(0.35_0.06_250)]" :
                                                activity.type === "event" ? "bg-[oklch(0.94_0.06_45)] text-[oklch(0.45_0.12_45)]" :
                                                    "bg-[oklch(0.95_0.04_85)] text-[oklch(0.40_0.08_85)]"
                                            }`}>
                                            <Activity className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">{activity.item}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatRelativeTime(activity._creationTime)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-display text-lg">Family Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Members</span>
                                <span className="font-medium">{memberCount}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(memberCount * 10, 100)}%` }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Events This Month</span>
                                <span className="font-medium">{eventCount}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-[oklch(0.65_0.12_45)] transition-all duration-500" style={{ width: `${Math.min(eventCount * 10, 100)}%` }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Investments</span>
                                <span className="font-medium">{(investments ?? []).length}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-[oklch(0.70_0.10_85)] transition-all duration-500" style={{ width: `${Math.min((investments ?? []).length * 15, 100)}%` }} />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next Event</span>
                                <span className="text-sm font-medium">{nextEvent?.title ?? "None"}</span>
                            </div>
                            {nextEvent && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(nextEvent.startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
