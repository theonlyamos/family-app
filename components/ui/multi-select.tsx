"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

type Option = {
    label: string
    value: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleToggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const handleRemove = (value: string) => {
        onChange(selected.filter((item) => item !== value))
    }

    const handleClearAll = () => {
        onChange([])
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between min-h-10 h-auto"
                    >
                        <span className="truncate">
                            {selected.length === 0
                                ? placeholder
                                : `${selected.length} selected`}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                                {options.map((option) => {
                                    const isSelected = selected.includes(option.value)
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => handleToggle(option.value)}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleToggle(option.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <span>{option.label}</span>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                        {selected.length > 0 && (
                            <div className="border-t p-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={handleClearAll}
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected items as badges */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selected.map((value) => {
                        const option = options.find((o) => o.value === value)
                        return (
                            <Badge key={value} variant="secondary" className="pl-2 pr-1">
                                {option?.label || value}
                                <button
                                    type="button"
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleRemove(value)
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleRemove(value)
                                    }}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
