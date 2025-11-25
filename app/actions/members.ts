"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { saveDocument } from "./documents";

export async function createMember(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const middleName = formData.get("middleName") as string;
    const gender = formData.get("gender") as string;
    const dob = formData.get("dob") ? new Date(formData.get("dob") as string) : null;
    const dod = formData.get("dod") ? new Date(formData.get("dod") as string) : null;
    const pob = formData.get("pob") as string;
    const occupation = formData.get("occupation") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const addressLine2 = formData.get("addressLine2") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zip = formData.get("zip") as string;
    const country = formData.get("country") as string;
    const fatherId = formData.get("fatherId") as string | null;
    const motherId = formData.get("motherId") as string | null;
    const aliases = formData.get("aliases") as string;
    const education = formData.get("education") as string;
    const role = formData.get("role") as string || "Member";
    const file = formData.get("file") as File;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    }

    try {
        const member = await prisma.member.create({
            data: {
                firstName,
                lastName,
                middleName,
                gender,
                dob,
                dod,
                pob,
                occupation,
                email,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                zip,
                country,
                fatherId: fatherId || null,
                motherId: motherId || null,
                aliases,
                education,
                role,
            },
        });

        if (file && file.size > 0) {
            await saveDocument(file, { memberIds: [member.id] });
        }
    } catch (error) {
        console.error("Failed to create member:", error);
        throw new Error("Failed to create member");
    }

    revalidatePath("/dashboard/members");
    redirect("/dashboard/members");
}

export async function updateMember(id: string, formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const middleName = formData.get("middleName") as string;
    const gender = formData.get("gender") as string;
    const dob = formData.get("dob") ? new Date(formData.get("dob") as string) : null;
    const dod = formData.get("dod") ? new Date(formData.get("dod") as string) : null;
    const pob = formData.get("pob") as string;
    const occupation = formData.get("occupation") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const addressLine2 = formData.get("addressLine2") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zip = formData.get("zip") as string;
    const country = formData.get("country") as string;
    const fatherId = formData.get("fatherId") as string;
    const motherId = formData.get("motherId") as string;
    const aliases = formData.get("aliases") as string;
    const education = formData.get("education") as string;
    const file = formData.get("file") as File;

    // Handle empty strings as null for relations
    const fatherIdValue = fatherId === "" ? null : fatherId;
    const motherIdValue = motherId === "" ? null : motherId;

    try {
        await prisma.member.update({
            where: { id },
            data: {
                firstName,
                lastName,
                middleName,
                gender,
                dob,
                dod,
                pob,
                occupation,
                email,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                zip,
                country,
                fatherId: fatherIdValue,
                motherId: motherIdValue,
                aliases,
                education,
            },
        });

        if (file && file.size > 0) {
            await saveDocument(file, { memberIds: [id] });
        }
    } catch (error) {
        console.error("Failed to update member:", error);
        throw new Error("Failed to update member");
    }

    revalidatePath(`/dashboard/members/${id}`);
    revalidatePath("/dashboard/members");
    redirect("/dashboard/members");
}

export async function deleteMember(id: string) {
    try {
        await prisma.member.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Failed to delete member:", error);
        throw new Error("Failed to delete member");
    }

    revalidatePath("/dashboard/members");
}
