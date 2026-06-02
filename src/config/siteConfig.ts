/**
 * Centralised site configuration.
 * All hardcoded contact details, social URLs, and external links live here.
 * Import this object wherever you need these values instead of inlining strings.
 */
export const siteConfig = {
  name: "DevPath",
  tagline:
    "Empowering Devs to master their craft through structured learning, real-world projects, and a supportive community.",

  contact: {
    email: "devpathind.community@gmail.com",
    complaintsForm: "https://forms.gle/ptMuZVQU1nkpnbCz9",
  },

  social: {
    github: "https://github.com/devpathindcommunity-india/DevPath-Web",
    instagram: "https://www.instagram.com/devpath_community/",
    linkedin: "https://www.linkedin.com/company/devpath-community/",
  },

  /**
   * Featured repositories shown on the /opensource page.
   * Set `isPublic: false` and `url: null` for repos that are not yet ready.
   * The UI will render a disabled "Coming Soon" state for those entries.
   */
  featuredRepos: [
    {
      name: "DevPath Website",
      description: "Official Community Website",
      longDescription:
        "The official website for the DevPath community, built with Next.js, Tailwind CSS, and Firebase.",
      language: "TypeScript",
      languageColor: "bg-blue-500",
      stars: "120+",
      icon: "BookOpen" as const,
      url: "https://github.com/devpathindcommunity-india/DevPath-Web",
      isPublic: true,
    },
    {
      name: "DevPath CLI",
      description: "Command Line Tool",
      longDescription:
        "A powerful CLI tool to help developers navigate their learning paths and access resources directly from the terminal.",
      language: "JavaScript",
      languageColor: "bg-yellow-400",
      stars: "45+",
      icon: "Code2" as const,
      url: null,
      isPublic: false,
    },
    {
      name: "Learning Resources",
      description: "Curated Lists",
      longDescription:
        "A comprehensive collection of free learning resources, roadmaps, and guides for developers of all levels.",
      language: "Markdown",
      languageColor: "bg-purple-500",
      stars: "80+",
      icon: "Globe" as const,
      url: null,
      isPublic: false,
    },
  ],
} as const;
