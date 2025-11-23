import { getMembers } from "@/app/data/members"
import { AddMemberForm } from "./add-member-form"

export default async function AddMemberPage() {
    const members = await getMembers()

    return <AddMemberForm members={members} />
}
