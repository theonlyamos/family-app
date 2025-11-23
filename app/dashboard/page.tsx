import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, FileText, Folder, Cake, Utensils, Mountain } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Members */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-green-600 font-medium">+2 from last month</p>
                    </CardContent>
                </Card>

                {/* Total Dues Collected */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Dues Collected</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">$</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,250</div>
                        <p className="text-xs text-green-600 font-medium">+15% from last month</p>
                    </CardContent>
                </Card>

                {/* Outstanding Dues */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Dues</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$300</div>
                        <p className="text-xs text-muted-foreground">Next due: $50 on 08/15</p>
                    </CardContent>
                </Card>

                {/* Total Documents */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48</div>
                        <p className="text-xs text-muted-foreground">Last: Family Trust.pdf</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Row */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Recent Events (Left - 4 cols) */}
                <Card className="md:col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Events</CardTitle>
                        <Button variant="link" className="text-blue-600 h-auto p-0" asChild>
                            <Link href="/dashboard/calendar">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <Cake className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Grandma's Birthday</p>
                                <p className="text-sm text-muted-foreground">August 10, 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <Utensils className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Family Dinner</p>
                                <p className="text-sm text-muted-foreground">August 17, 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <Mountain className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Annual Camping Trip</p>
                                <p className="text-sm text-muted-foreground">August 23, 2024</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* New Members (Right - 3 cols) */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>New Members</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src="/avatars/jane.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">Jane Doe</p>
                                <p className="text-sm text-muted-foreground">Joined: July 28, 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src="/avatars/john.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">John Doe</p>
                                <p className="text-sm text-muted-foreground">Joined: July 15, 2024</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
