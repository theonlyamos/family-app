"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateDueModal } from "@/components/dues/create-due-modal"
import { Member } from "@prisma/client"

interface DuesClientWrapperProps {
    members: Member[]
}

export function DuesClientWrapper({ members }: DuesClientWrapperProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Log a New Due
            </Button>
            <CreateDueModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                members={members}
            />
        </>
    )
}
