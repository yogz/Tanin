export type Theme = "purple" | "blue";

export const THEMES = {
    purple: {
        name: "Violet & Rose",
        primary: "from-purple-400 via-pink-400 to-purple-400",
        gradient: "from-purple-900/40 via-background to-background",
        accent1: "from-purple-500/30 to-pink-500/30",
        accent2: "from-purple-600 to-pink-600",
        accentHover: "from-purple-700 to-pink-700",
        icon: "text-purple-400",
        glow: "rgba(139, 92, 246, 0.3)",
        glowBg1: "bg-purple-500/10",
        glowBg2: "bg-pink-500/10",
    },
    blue: {
        name: "Bleu & Cyan",
        primary: "from-blue-400 via-cyan-400 to-blue-400",
        gradient: "from-blue-900/40 via-background to-background",
        accent1: "from-blue-500/30 to-cyan-500/30",
        accent2: "from-blue-600 to-cyan-600",
        accentHover: "from-blue-700 to-cyan-700",
        icon: "text-blue-400",
        glow: "rgba(59, 130, 246, 0.3)",
        glowBg1: "bg-blue-500/10",
        glowBg2: "bg-cyan-500/10",
    },
} as const;
