"use client"

import * as React from "react"
import { Upload, X, File, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
    value?: File[]
    onChange: (files: File[]) => void
    multiple?: boolean
    accept?: string
    maxSize?: number // in MB
    className?: string
}

export function FileUpload({
    value = [],
    onChange,
    multiple = false,
    accept,
    maxSize = 10,
    className,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files)
        handleFiles(droppedFiles)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files)
            handleFiles(selectedFiles)
        }
    }

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter((file) => {
            if (maxSize && file.size > maxSize * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size is ${maxSize}MB`)
                return false
            }
            return true
        })

        if (multiple) {
            onChange([...value, ...validFiles])
        } else {
            onChange(validFiles.slice(0, 1))
        }
    }

    const removeFile = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index)
        onChange(newFiles)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileInput}
                    className="hidden"
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                    {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">
                    {multiple ? "Multiple files allowed" : "Single file only"} • Max {maxSize}MB per file
                </p>
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                        {value.length} {value.length === 1 ? "file" : "files"} selected
                    </p>
                    <div className="space-y-2">
                        {value.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-white"
                            >
                                <div className="flex-shrink-0">
                                    {file.type.includes("image") ? (
                                        <FileText className="h-8 w-8 text-blue-500" />
                                    ) : (
                                        <File className="h-8 w-8 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(index)
                                    }}
                                    className="flex-shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
