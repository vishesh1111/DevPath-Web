import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getEmbedUrl = (url: string) => {
    if (!url) return '';

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        } else if (url.includes('youtube.com/embed/')) {
            return url; // Already embed link
        }else if(url.includes('youtube.com/shorts/')){
            videoId = url.split('/shorts/')[1]?.split('?')[0];
        }//for utube shorts
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
        // Convert view/sharing links to preview links
        return url.replace('/view', '/preview').replace('/usp=sharing', '');
    }

    return url;
};
