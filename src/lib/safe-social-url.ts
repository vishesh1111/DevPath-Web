export type SocialPlatform = 'github' | 'linkedin' | 'instagram';

type SocialLinks = Partial<Record<SocialPlatform, string>>;

const ALLOWED_SOCIAL_HOSTS: Record<SocialPlatform, string[]> = {
    github: ['github.com'],
    linkedin: ['linkedin.com'],
    instagram: ['instagram.com']
};

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    instagram: 'Instagram'
};

export const sanitizeSocialUrl = (value: string | undefined, platform: SocialPlatform): string => {
    const trimmedValue = value?.trim() || '';

    if (!trimmedValue) return '';

    let url: URL;
    try {
        url = new URL(trimmedValue);
    } catch {
        throw new Error(`${SOCIAL_LABELS[platform]} URL must be a valid https:// URL.`);
    }

    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

    if (url.protocol !== 'https:' || !ALLOWED_SOCIAL_HOSTS[platform].includes(hostname)) {
        throw new Error(`${SOCIAL_LABELS[platform]} URL must use https:// and match ${ALLOWED_SOCIAL_HOSTS[platform][0]}.`);
    }

    url.hash = '';
    return url.toString();
};

export const sanitizeSocialLinks = (links: SocialLinks): Record<SocialPlatform, string> => ({
    github: sanitizeSocialUrl(links.github, 'github'),
    linkedin: sanitizeSocialUrl(links.linkedin, 'linkedin'),
    instagram: sanitizeSocialUrl(links.instagram, 'instagram')
});

export const getSafeSocialUrl = (value: string | undefined, platform: SocialPlatform): string | null => {
    try {
        return sanitizeSocialUrl(value, platform) || null;
    } catch {
        return null;
    }
};
