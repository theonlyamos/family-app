export const dynamic = "force-dynamic"

import { getMember } from "@/app/data/members"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, FileText, Cake, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default async function MemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const member = await getMember(id)

    if (!member) {
        notFound()
    }

    // Helper to format date
    const formatDate = (date: Date | null) => {
        if (!date) return "Not applicable"
        return format(new Date(date), "MMMM d, yyyy")
    }

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card>
                <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                        <AvatarImage src={member.avatarUrl || ""} />
                        <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold">{member.firstName} {member.lastName}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                            <span className="font-medium text-foreground">{member.role}</span>
                            <span>•</span>
                            <span>Member since {new Date(member.createdAt).getFullYear()}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href={`/dashboard/members/${member.id}/edit`}>
                                Update Member
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/members/family-tree">
                                View in Family Tree
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content - Left Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Core Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Date of Birth</div>
                                    <div className="font-medium">{formatDate(member.dob)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Date of Death</div>
                                    <div className="font-medium">{formatDate(member.dod)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Gender</div>
                                    <div className="font-medium">{member.gender || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Place of Birth</div>
                                    <div className="font-medium">{member.pob || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Occupation</div>
                                    <div className="font-medium">{member.occupation || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Current Place of Stay</div>
                                    <div className="font-medium">{member.city}, {member.country}</div>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Education History</div>
                                <div className="font-medium">{member.education || "No education history recorded."}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                                <div className="font-medium">{member.phone || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Email Address</div>
                                <div className="font-medium">{member.email || "N/A"}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Addresses */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Location Addresses</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Address Line 1</div>
                                    <div className="font-medium">{member.addressLine1 || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Address Line 2</div>
                                    <div className="font-medium">{member.addressLine2 || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">City</div>
                                    <div className="font-medium">{member.city || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">State/Province</div>
                                    <div className="font-medium">{member.state || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Zip/Postal Code</div>
                                    <div className="font-medium">{member.zip || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Country</div>
                                    <div className="font-medium">{member.country || "N/A"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Family Background */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Family Background</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Father's Name</div>
                                    <div className="font-medium">
                                        {member.father ? `${member.father.firstName} ${member.father.lastName}` : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Mother's Name</div>
                                    <div className="font-medium">
                                        {member.mother ? `${member.mother.firstName} ${member.mother.lastName}` : "N/A"}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Aliases</div>
                                <div className="font-medium">{member.aliases || "N/A"}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Relationships - Placeholder for now */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Relationships</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Relationships functionality coming soon.
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Attended Events - Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Attended Events</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Events functionality coming soon.
                        </CardContent>
                    </Card>

                    {/* Uploaded Documents - Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Uploaded Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {member.documents && member.documents.length > 0 ? (
                                member.documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors group"
                                    >
                                        <FileText className="h-4 w-4 text-muted-foreground group-hover:text-blue-600" />
                                        <span className="text-sm font-medium truncate flex-1">{doc.name}</span>
                                    </a>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
