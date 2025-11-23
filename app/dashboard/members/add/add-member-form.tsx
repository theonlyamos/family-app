"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createMember } from "@/app/actions/members"
import { useState, useTransition } from "react"
import { Member } from "@prisma/client"
import { MemberSelect } from "@/components/members/member-select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AddMemberFormProps {
    members: Member[]
}


export function AddMemberForm({ members }: AddMemberFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [gender, setGender] = useState("")
    const [country, setCountry] = useState("")
    const [fatherId, setFatherId] = useState<string>("")
    const [motherId, setMotherId] = useState<string>("")

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            try {
                await createMember(formData)
                toast.success("Member created successfully!")
                router.push("/dashboard/members")
            } catch (error) {
                toast.error("Failed to create member. Please try again.")
                console.error("Error creating member:", error)
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Family Member</h1>
                <p className="text-muted-foreground mt-2">
                    Fill in the details below to add a new member to the family tree.
                </p>
            </div>

            <form action={handleSubmit}>
                <div className="space-y-6">
                    {/* Personal Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                    <Input id="firstName" name="firstName" placeholder="Enter first name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                                    <Input id="lastName" name="lastName" placeholder="Enter last name" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="middleName">Middle Name</Label>
                                    <Input id="middleName" name="middleName" placeholder="Enter middle name" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" value={gender} onValueChange={setGender}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="gender" value={gender} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" name="dob" type="date" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dod">Date of Death</Label>
                                    <Input id="dod" name="dod" type="date" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pob">Place of Birth</Label>
                                <Input id="pob" name="pob" placeholder="Enter city, state, country" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input id="occupation" name="occupation" placeholder="Enter occupation" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" placeholder="e.g., +1 555-123-4567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" placeholder="example@email.com" type="email" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Current Location</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="addressLine1">Address Line 1</Label>
                                <Input id="addressLine1" name="addressLine1" placeholder="e.g., 123 Main St" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="addressLine2">Address Line 2</Label>
                                <Input id="addressLine2" name="addressLine2" placeholder="Apt, suite, etc. (optional)" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" placeholder="Enter city" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state">State / Province</Label>
                                    <Input id="state" name="state" placeholder="Enter state or province" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="zip">Zip / Postal Code</Label>
                                    <Input id="zip" name="zip" placeholder="Enter zip code" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select name="country" value={country} onValueChange={setCountry}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usa">USA</SelectItem>
                                            <SelectItem value="canada">Canada</SelectItem>
                                            <SelectItem value="uk">UK</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="country" value={country} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Family & Other Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Family & Other Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fatherId">Father</Label>
                                    <MemberSelect
                                        members={members}
                                        value={fatherId}
                                        onValueChange={setFatherId}
                                        placeholder="Select father"
                                        name="fatherId"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="motherId">Mother</Label>
                                    <MemberSelect
                                        members={members}
                                        value={motherId}
                                        onValueChange={setMotherId}
                                        placeholder="Select mother"
                                        name="motherId"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aliases">Aliases</Label>
                                <Input id="aliases" name="aliases" placeholder="e.g., Nickname" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="education">Education History</Label>
                                <Textarea id="education" name="education" placeholder="List schools, degrees, and years attended..." className="h-24" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4 py-6">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/members">Cancel</Link>
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
