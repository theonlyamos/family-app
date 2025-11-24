import { getMember } from "@/app/data/members"
import { getMembers } from "@/app/data/members"
import { notFound } from "next/navigation"
import { AddMemberForm } from "../../add/add-member-form"

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [member, allMembers] = await Promise.all([
        getMember(id),
        getMembers()
    ])

    if (!member) {
        notFound()
    }

    return (
        <div className="container mx-auto py-6">
            <AddMemberForm
                members={allMembers}
                initialData={member}
                mode="update"
            />
        </div>
    )
}
