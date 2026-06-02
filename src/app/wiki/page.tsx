"use client";

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Search,
    ChevronRight,
    Book,
    Code,
    FileText,
    HelpCircle,
    ThumbsUp,
    ThumbsDown,
    Github,
    Users,
    MapPin,
    MessageCircle,
    Calendar,
    X,
} from 'lucide-react';
import Fuse from 'fuse.js';
import Button from '@/components/ui/Button';
import styles from './Wiki.module.css';
import { wikiContent } from '@/data/wikiContent';
import { wikiSearchIndex } from '@/data/wikiSearchIndex';
import { searchArticles } from '@/utils/wikiSearch';
import WikiSearchResults from './WikiSearchResults';
import { copyToClipboard } from '@/lib/clipboard';
import { useNotificationActions } from '@/stores/ui-store';

const categories = [
    {
        title: 'Getting Started',
        items: [
            { id: 'intro', title: 'Introduction to DevPath', icon: <Book size={16} /> },
            { id: 'setup', title: 'Setting Up Your Profile', icon: <FileText size={16} /> },
            { id: 'xp', title: 'Understanding XP System', icon: <HelpCircle size={16} /> },
        ],
    },
    {
        title: 'Learning Paths',
        items: [
            { id: 'react', title: 'Full Stack React Guide', icon: <Code size={16} /> },
            { id: 'python', title: 'Python for AI Roadmap', icon: <Code size={16} /> },
        ],
    },
    {
        title: 'Community',
        items: [
            { id: 'community-offerings', title: 'What Community Offers', icon: <Users size={16} /> },
            { id: 'city-leads', title: 'City Leads', icon: <MapPin size={16} /> },
            { id: 'technical-heads', title: 'Technical Heads', icon: <Code size={16} /> },
            { id: 'wp-community', title: 'WhatsApp Community', icon: <MessageCircle size={16} /> },
            { id: 'hackfiesta', title: 'HackFiesta', icon: <Calendar size={16} /> },
            { id: 'guidelines', title: 'Code of Conduct', icon: <FileText size={16} /> },
            { id: 'contributing', title: 'How to Contribute', icon: <Github size={16} /> },
            { id: 'open-source', title: 'Open Source', icon: <Github size={16} /> },
        ],
    },
];

function slugToLabel(slug: string): string {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function WikiPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showSuccess, showError } = useNotificationActions();
    const [searchQuery, setSearchQuery] = useState('');

    const activeArticleParam = searchParams.get('article');
    const activeArticle =
        activeArticleParam && wikiContent[activeArticleParam as keyof typeof wikiContent]
            ? activeArticleParam
            : 'intro';

    const allItems = useMemo(
        () => categories.flatMap((category) => category.items.map((item) => ({ ...item, category: category.title }))),
        []
    );

    const fuse = useMemo(
        () => new Fuse(allItems, { keys: ['title'], threshold: 0.4, includeMatches: true }),
        [allItems]
    );

    const fuseResults = useMemo(() => fuse.search(searchQuery), [fuse, searchQuery]);

    const matchMap = useMemo(
        () =>
            new Map(
                fuseResults.map((result) => [
                    result.item.id,
                    result.matches?.find((match) => match.key === 'title')?.indices,
                ])
            ),
        [fuseResults]
    );

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) {
            return categories;
        }

        const matchedIds = new Set(fuseResults.map((result) => result.item.id));

        return categories
            .map((category) => ({
                ...category,
                items: category.items.filter((item) => matchedIds.has(item.id)),
            }))
            .filter((category) => category.items.length > 0);
    }, [searchQuery, fuseResults]);

    const searchResults = useMemo(() => searchArticles(wikiSearchIndex, searchQuery), [searchQuery]);
    const isSearching = searchQuery.trim().length > 0;

    const handleArticleChange = (id: string) => {
        router.push(`/wiki?article=${id}`, { scroll: false });
    };

    const handleResultSelect = (id: string) => {
        handleArticleChange(id);
        setSearchQuery('');
    };

    const highlightMatch = (text: string, indices?: readonly [number, number][]) => {
        if (!indices || indices.length === 0) return text;
        const result: (string | React.ReactNode)[] = [];
        let lastIndex = 0;

        for (const [start, end] of indices) {
            result.push(text.slice(lastIndex, start));
            result.push(
                <mark key={`${start}-${end}`} className={styles.highlight}>
                    {text.slice(start, end + 1)}
                </mark>
            );
            lastIndex = end + 1;
        }

        result.push(text.slice(lastIndex));
        return <span style={{ whiteSpace: 'normal' }}>{result}</span>;
    };

    useEffect(() => {
        const articleBody = document.querySelector(`.${styles.articleBody}`);
        if (!articleBody) return;

        const preElements = articleBody.querySelectorAll('pre');

        preElements.forEach((pre) => {
            if (pre.parentElement?.classList.contains('code-wrapper')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper relative group w-full';
            pre.parentNode?.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const button = document.createElement('button');
            button.className = 'absolute right-3 top-3 px-2 py-1 text-xs font-semibold bg-zinc-900/80 text-zinc-300 rounded border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-white transition-all duration-200 shadow-md cursor-pointer backdrop-blur-sm';
            button.innerHTML = 'Copy';
            button.type = 'button';

            button.addEventListener('click', async () => {
                const codeText = pre.textContent || '';
                const copiedSuccessfully = await copyToClipboard(codeText);

                if (copiedSuccessfully) {
                    button.innerHTML = 'Copied!';
                    button.className = 'absolute right-3 top-3 px-2 py-1 text-xs font-semibold bg-emerald-600 text-white rounded border border-emerald-500 transition-all duration-200 shadow-md';
                    showSuccess('Code copied to clipboard.');
                    setTimeout(() => {
                        button.innerHTML = 'Copy';
                        button.className = 'absolute right-3 top-3 px-2 py-1 text-xs font-semibold bg-zinc-900/80 text-zinc-300 rounded border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-white transition-all duration-200 shadow-md cursor-pointer backdrop-blur-sm';
                    }, 2000);
                } else {
                    showError('Copying code is not supported in this browser.');
                }
            });

            wrapper.appendChild(button);
        });
    }, [activeArticle, showError, showSuccess]);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={16} />
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search wiki articles"
                    />
                    {isSearching && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            className={styles.clearSearch}
                            onClick={() => setSearchQuery('')}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {!isSearching && (
                    <nav>
                        {categories.map((category, index) => (
                            <div key={index} className={styles.category}>
                                <h3 className={styles.categoryTitle}>{category.title}</h3>
                                {category.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`${styles.navLink} ${activeArticle === item.id ? styles.active : ''}`}
                                        onClick={() => handleArticleChange(item.id)}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </nav>
                )}

                {isSearching && (
                    <>
                        <nav>
                            {filteredCategories.map((category, index) => (
                                <div key={index} className={styles.category}>
                                    <h3 className={styles.categoryTitle}>{category.title}</h3>
                                    {category.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`${styles.navLink} ${activeArticle === item.id ? styles.active : ''}`}
                                            onClick={() => handleArticleChange(item.id)}
                                        >
                                            {item.icon}
                                            {highlightMatch(item.title, matchMap.get(item.id))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </nav>

                        <WikiSearchResults results={searchResults} query={searchQuery} onSelect={handleResultSelect} />
                    </>
                )}
            </aside>

            <main className={styles.content}>
                <div className={styles.breadcrumb}>
                    <span>Docs</span>
                    <ChevronRight size={14} />
                    <span>{categories.find((category) => category.items.some((item) => item.id === activeArticle))?.title ?? slugToLabel(activeArticle)}</span>
                    <ChevronRight size={14} />
                    <span>{wikiContent[activeArticle as keyof typeof wikiContent]?.title ?? slugToLabel(activeArticle)}</span>
                </div>

                <article>
                    <div className={styles.articleHeader}>
                        <h1 className={styles.title}>{wikiContent[activeArticle as keyof typeof wikiContent]?.title ?? 'Introduction to DevPath'}</h1>
                        <div className={styles.meta}>
                            <span>Last updated: {wikiContent[activeArticle as keyof typeof wikiContent]?.lastUpdated ?? 'Dec 14, 2025'}</span>
                            <span>Reading time: {wikiContent[activeArticle as keyof typeof wikiContent]?.readingTime ?? '5 min'}</span>
                        </div>
                    </div>

                    <div className={styles.articleBody}>
                        {wikiContent[activeArticle as keyof typeof wikiContent]?.content || <p>Content coming soon...</p>}
                    </div>

                    <div className={styles.feedback}>
                        <span>Was this article helpful?</span>
                        <div className={styles.feedbackButtons}>
                            <Button variant="ghost" icon={<ThumbsUp size={16} />}>Yes</Button>
                            <Button variant="ghost" icon={<ThumbsDown size={16} />}>No</Button>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}

export default function WikiPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-medium">
                    Loading Documentation...
                </div>
            }
        >
            <WikiPageContent />
        </Suspense>
    );
}
