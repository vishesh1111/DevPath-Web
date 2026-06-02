"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar, Video, MapPin, ExternalLink } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styles from './Events.module.css';

export default function Events() {
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [completedEvents, setCompletedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(collection(db, 'events'), orderBy('date', 'asc'));
                const snapshot = await getDocs(q);
                const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setUpcomingEvents(allEvents.filter((e: any) => e.completed !== true));
                setCompletedEvents(allEvents.filter((e: any) => e.completed === true));
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({ container: containerRef });

    return (
        <section className={styles.events}>
            <div className={styles.header}>
                <h2 className={styles.title}>Upcoming Events</h2>
                <p className={styles.subtitle}>
                    Join live sessions, workshops, and challenges to level up your skills.
                </p>
            </div>

            <div className={styles.scrollContainer} ref={containerRef}>
                <div className={styles.timeline}>
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground w-full">Loading events...</div>
                    ) : upcomingEvents.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground w-full">No upcoming events scheduled.</div>
                    ) : (
                        upcomingEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))
                    )}
                </div>
            </div>

            {completedEvents.length > 0 && (
                <>
                    <div className={styles.header} style={{ marginTop: '4rem' }}>
                        <h2 className={styles.title}>Completed Events</h2>
                        <p className={styles.subtitle}>
                            Check out our past events and claim your certificates.
                        </p>
                    </div>

                    <div className={styles.scrollContainer}>
                        <div className={styles.timeline}>
                            {completedEvents.map((event, index) => (
                                <EventCard key={event.id} event={event} index={index} isCompleted={true} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

function EventCard({ event, index, isCompleted = false }: { event: any, index: number, isCompleted?: boolean }) {
    return (
        <motion.div
            className={styles.eventCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                zIndex: 10
            }}
            style={{ perspective: 1000 }}
        >
            <div className={styles.cardContent}>
                <div className={styles.thumbnail}>
                    {event.image && event.image.trim() !== '' ? (
                        <Image
                            src={event.image}
                            alt={event.title || 'Event Image'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 300px, 350px"
                            priority={index === 0 && !isCompleted}
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1a1f35]" />
                    )}
                </div>

                <div className={styles.details}>
                    <div className={styles.dateBadge}>
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleDateString()}
                    </div>

                    <h3 className={styles.eventTitle}>{event.title}</h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {event.description}
                    </p>

                    <div className={styles.meta}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} /> {event.location || 'Online'}
                        </span>

                        {isCompleted ? (
                            <div className="flex items-center gap-3 ml-auto">
                                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full">
                                    Completed
                                </span>
                                <a aria-label="Link" 
                                    href="/certificate"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-colors"
                                >
                                    View Rankings <ExternalLink size={12} />
                                </a>
                            </div>
                        ) : (
                            event.registerLink && (
                                <a aria-label="Link" 
                                    href={event.registerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold hover:bg-primary/90 transition-colors ml-auto"
                                >
                                    Register <ExternalLink size={12} />
                                </a>
                            )
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
