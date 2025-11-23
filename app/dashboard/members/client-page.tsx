"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Member } from "@prisma/client"

interface MembersClientPageProps {
    members: Member[]
}

export default function MembersClientPage({ members }: MembersClientPageProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRole = roleFilter === "all" || member.role.toLowerCase() === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin': return "bg-green-100 text-green-700 hover:bg-green-100/80";
            case 'parent': return "bg-amber-100 text-amber-700 hover:bg-amber-100/80";
            case 'child': return "bg-purple-100 text-purple-700 hover:bg-purple-100/80";
            default: return "bg-gray-100 text-gray-700 hover:bg-gray-100/80";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Members</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search members..."
                            className="pl-9 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select defaultValue="all" onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[130px] bg-white">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href="/dashboard/members/add">
                            <Plus className="mr-2 h-4 w-4" /> Add Member
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[100px]">AVATAR</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead>EMAIL</TableHead>
                            <TableHead>ROLE</TableHead>
                            <TableHead className="text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={member.avatarUrl || ""} />
                                            <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{member.firstName} {member.lastName}</TableCell>
                                    <TableCell className="text-muted-foreground">{member.email || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn("font-normal", getRoleColor(member.role))}>
                                            {member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                                            <Link href={`/dashboard/members/${member.id}`}>
                                                Edit
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
