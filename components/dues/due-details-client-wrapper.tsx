"use client"

import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { CollectDueModal } from "@/components/dues/collect-due-modal"
import { CreateDueModal } from "@/components/dues/create-due-modal"
import { Due } from "@prisma/client"
import { deleteDue } from "@/app/actions/dues"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Member } from "@prisma/client"

interface DueDetailsClientWrapperProps {
    due: Due
    members: Member[]
}

export function DueDetailsClientWrapper({ due, members }: DueDetailsClientWrapperProps) {
    const router = useRouter()
    const [isCollectModalOpen, setIsCollectModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteDue(due.id)
                router.push("/dashboard/dues")
            } catch (error) {
                console.error("Failed to delete due:", error)
            }
        })
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Edit</Button>
                <Button onClick={() => setIsCollectModalOpen(true)}>Collect Dues</Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPending}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the due
                                "{due.title}" and remove it from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                {isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <CollectDueModal open={isCollectModalOpen} onOpenChange={setIsCollectModalOpen} due={due} members={members} />
            <CreateDueModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                initialData={{
                    id: due.id,
                    name: due.title,
                    amount: due.amount.toString(),
                    date: new Date(due.dueDate),
                    members: "all", // TODO: Fetch actual assigned members
                    recurrence: "monthly", // TODO: Add recurrence to Due model
                    description: due.description || ""
                }}
            />
        </>
    )
}
