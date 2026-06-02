"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import Button from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import { useThemePreference, type ThemePreference } from "@/stores/ui-store"

export function ThemeToggle() {
    const { theme, resolvedTheme, isThemeMounted, applyTheme } = useThemePreference()
    const { user, updateUserProfile } = useAuth()
    const pendingThemeRef = React.useRef<ThemePreference | null>(null)

    React.useEffect(() => {
        if (!isThemeMounted) return

        const savedTheme = user?.preferences?.theme

        if (pendingThemeRef.current) {
            if (savedTheme === pendingThemeRef.current) {
                pendingThemeRef.current = null
            }
            return
        }

        if (!savedTheme || savedTheme === resolvedTheme) return

        applyTheme(savedTheme)
    }, [applyTheme, isThemeMounted, resolvedTheme, user?.preferences?.theme])

    const handleToggle = async () => {
        const currentTheme = (resolvedTheme || theme) === "light" ? "light" : "dark"
        const nextTheme: ThemePreference = currentTheme === "light" ? "dark" : "light"

        applyTheme(nextTheme)

        if (!user) return

        pendingThemeRef.current = nextTheme

        try {
            await updateUserProfile({
                preferences: {
                    ...user.preferences,
                    theme: nextTheme
                }
            })
        } catch (error) {
            pendingThemeRef.current = null
            console.error("Error saving theme preference:", error)
        }
    }

    if (!isThemeMounted) {
        return (
            <Button aria-label="Action button"
                variant="ghost"
                disabled
                aria-hidden="true"
                className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 p-0 flex items-center justify-center"
            >
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <Button aria-label="Toggle theme"
            variant="ghost"
            onClick={handleToggle}
            className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-colors p-0 flex items-center justify-center"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-400" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
