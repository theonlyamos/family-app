"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
    {
        title: "Total Members",
        value: "12",
        change: "+2 from last month",
        trend: "up",
        icon: Users,
        iconBg: "bg-[oklch(0.94_0.02_145)]",
        iconColor: "text-[oklch(0.35_0.06_145)]"
    },
    {
        title: "Upcoming Events",
        value: "3",
        change: "Next: Family Dinner",
        trend: "neutral",
        icon: Calendar,
        iconBg: "bg-[oklch(0.94_0.06_45)]",
        iconColor: "text-[oklch(0.45_0.12_45)]"
    },
    {
        title: "Total Investments",
        value: "$45,231.89",
        change: "+20.1% from last month",
        trend: "up",
        icon: TrendingUp,
        iconBg: "bg-[oklch(0.95_0.04_85)]",
        iconColor: "text-[oklch(0.40_0.08_85)]"
    },
    {
        title: "Active Activities",
        value: "+573",
        change: "Since last hour",
        trend: "up",
        icon: Activity,
        iconBg: "bg-[oklch(0.94_0.02_250)]",
        iconColor: "text-[oklch(0.35_0.06_250)]"
    }
]

export default function DashboardPage() {
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
                            {[
                                { action: "Added new member", item: "Emily Miller", time: "2 hours ago", type: "member" },
                                { action: "Uploaded document", item: "Home Insurance Policy", time: "Yesterday", type: "document" },
                                { action: "Event scheduled", item: "Family Reunion", time: "3 days ago", type: "event" },
                                { action: "Investment updated", item: "Apple Inc. shares", time: "1 week ago", type: "investment" },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        activity.type === "member" ? "bg-[oklch(0.94_0.02_145)] text-[oklch(0.35_0.06_145)]" :
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
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                                </div>
                            ))}
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
                                <span className="text-muted-foreground">Storage Used</span>
                                <span className="font-medium">42%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full w-[42%] rounded-full bg-primary transition-all duration-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Events This Month</span>
                                <span className="font-medium">8</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full w-[66%] rounded-full bg-[oklch(0.65_0.12_45)] transition-all duration-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Documents</span>
                                <span className="font-medium">24</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full w-[30%] rounded-full bg-[oklch(0.70_0.10_85)] transition-all duration-500" />
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next Event</span>
                                <span className="text-sm font-medium">Family Dinner</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Tomorrow at 7:00 PM</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
