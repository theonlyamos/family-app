"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function Header() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Get current icon based on theme
    const getThemeIcon = () => {
        if (!mounted) return <Sun className="h-5 w-5" />
        
        const currentTheme = resolvedTheme || theme
        if (currentTheme === "dark") {
            return <Moon className="h-5 w-5" />
        }
        return <Sun className="h-5 w-5" />
    }

    // Cycle through themes: light -> dark -> system -> light
    const cycleTheme = () => {
        if (theme === "light") {
            setTheme("dark")
        } else if (theme === "dark") {
            setTheme("system")
        } else {
            setTheme("light")
        }
    }

    // Get theme label
    const getThemeLabel = () => {
        if (!mounted) return "Light"
        const currentTheme = resolvedTheme || theme
        if (theme === "system") {
            return `System (${currentTheme})`
        }
        return theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : "Light"
    }

    return (
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex h-16 items-center px-6 gap-4">
                {/* Spacer to push content to right */}
                <div className="flex-1"></div>
                
                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    {/* Notification bell */}
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="relative rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-gentle-pulse" />
                    </Button>
                    
                    {/* Theme toggle with dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="relative rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
                            >
                                {getThemeIcon()}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Current: {getThemeLabel()}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="rounded-lg cursor-pointer"
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="mr-2 h-4 w-4" />
                                Light
                                {theme === "light" && <span className="ml-auto text-primary">●</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="rounded-lg cursor-pointer"
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="mr-2 h-4 w-4" />
                                Dark
                                {theme === "dark" && <span className="ml-auto text-primary">●</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="rounded-lg cursor-pointer"
                                onClick={() => setTheme("system")}
                            >
                                <Laptop className="mr-2 h-4 w-4" />
                                System
                                {theme === "system" && <span className="ml-auto text-primary">●</span>}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-xl ring-offset-background transition-all duration-200 hover:bg-secondary/80">
                                <Avatar className="h-9 w-9 ring-2 ring-primary/10 transition-all duration-200">
                                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">FM</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal p-4">
                                <div className="flex flex-col space-y-1.5">
                                    <p className="text-sm font-semibold leading-none">Family Admin</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        admin@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-lg cursor-pointer transition-colors">
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg cursor-pointer transition-colors">
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
