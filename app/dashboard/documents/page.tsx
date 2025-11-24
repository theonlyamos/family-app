import { getDocuments } from "@/app/data/documents";
import { getMembers } from "@/app/data/members";
import DocumentsClientPage from "./client-page";

export default async function DocumentsPage() {
    const documents = await getDocuments();
    const members = await getMembers();

    return <DocumentsClientPage documents={documents} members={members} />;
}
