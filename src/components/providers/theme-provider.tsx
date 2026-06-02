"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { useUIStore, type ThemePreference } from "@/stores/ui-store"

function ThemeStoreBridge() {
    const { theme, resolvedTheme, setTheme } = useTheme()
    const syncTheme = useUIStore((state) => state.syncTheme)
    const setThemeApplier = useUIStore((state) => state.setThemeApplier)

    React.useEffect(() => {
        syncTheme(theme, resolvedTheme)
    }, [resolvedTheme, syncTheme, theme])

    React.useEffect(() => {
        setThemeApplier((nextTheme: ThemePreference) => setTheme(nextTheme))
    }, [setTheme, setThemeApplier])

    return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <ThemeStoreBridge />
            {children}
        </NextThemesProvider>
    )
}
