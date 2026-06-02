"use client"
import { motion, useReducedMotion } from "framer-motion"
import { useState, useEffect } from "react"

export function FloatingParticles() {
    const [mounted, setMounted] = useState(false)
    const [particles, setParticles] = useState<Array<{ symbol: string, delay: number, duration: number, x: number, y: number, initialX: number, initialY: number }>>([])
    // const [isMobile, setIsMobile] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    useEffect(() => {
        setMounted(true)

        // // Check if mobile
        // const checkMobile = () => setIsMobile(window.innerWidth < 768)
        // checkMobile()
        // // window.addEventListener('resize', checkMobile)

        const particleConfig = [
            { symbol: "</>", delay: 0, duration: 15, x: 100, y: -100 },
            { symbol: "{ }", delay: 2, duration: 18, x: -80, y: -120 },
            { symbol: "[ ]", delay: 4, duration: 20, x: 120, y: 80 },
            { symbol: "( )", delay: 1, duration: 17, x: -100, y: 100 },
            { symbol: "=>", delay: 3, duration: 16, x: 80, y: -80 },
            { symbol: "&&", delay: 5, duration: 19, x: -120, y: -100 },
        ]

        const isMobileDevice = window.innerWidth < 768
        const configToUse = isMobileDevice
            ? particleConfig.slice(0, 3)
            : particleConfig

        setParticles(configToUse.map(p => ({
            ...p,
            initialX: Math.random() * 100,
            initialY: Math.random() * 100
        })))

    }, [])

    // Don't render if user prefers reduced motion or not mounted
    if (!mounted || shouldReduceMotion) return null

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
            style={{ contain: 'strict' }}
        >
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute text-cyan-500/10 dark:text-cyan-500/10 font-mono text-2xl"
                    style={{
                        left: `${particle.initialX}%`,
                        top: `${particle.initialY}%`,
                        willChange: 'transform',
                    }}
                    animate={{
                        y: [0, particle.y, 0],
                        x: [0, particle.x, 0],
                        opacity: [0.1, 0.3, 0.1],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {particle.symbol}
                </motion.div>
            ))}
        </div>
    )
}
