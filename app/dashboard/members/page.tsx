import { getMembers } from "@/app/data/members";
import MembersClientPage from "./client-page";

export default async function MembersPage() {
    const members = await getMembers();

    return <MembersClientPage members={members} />;
}
