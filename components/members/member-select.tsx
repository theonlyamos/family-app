"use client"

import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { Member } from "@prisma/client"

interface MemberSelectProps {
    members: Member[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    name?: string
}

export function MemberSelect({
    members,
    value,
    onValueChange,
    placeholder = "Select member...",
    name,
}: MemberSelectProps) {
    const options: ComboboxOption[] = members.map((member) => ({
        value: member.id,
        label: `${member.firstName} ${member.lastName}`,
    }))

    return (
        <>
            <Combobox
                options={options}
                value={value}
                onValueChange={onValueChange}
                placeholder={placeholder}
                emptyMessage="No members found."
            />
            {name && <input type="hidden" name={name} value={value || ""} />}
        </>
    )
}
