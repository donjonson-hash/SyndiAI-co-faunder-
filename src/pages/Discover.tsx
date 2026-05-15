import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import SwipeCard from "@/components/SwipeCard";
import CompatibilityModal from "@/components/CompatibilityModal";
import BottomNav from "@/components/BottomNav";
import type { Profile } from "@db/schema";

// Demo profiles for non-authenticated users
const demoProfiles: Profile[] = [
  {
    id: 1, userId: 1, displayName: "Sarah Chen",
    title: "Full-Stack Developer & AI Enthusiast",
    bio: "Building the future of intelligent automation. 5 years of experience in SaaS and ML.",
    avatar: "/avatar-founder-1.jpg", location: "San Francisco, CA",
    skills: ["React", "Node.js", "Python", "TensorFlow", "AWS", "PostgreSQL"],
    lookingFor: "Product-minded co-founder with growth hacking skills",
    startupIdea: "AI-powered personal productivity assistant that learns your work patterns and automatically optimizes your schedule, email responses, and task prioritization using large language models.",
    experienceLevel: "expert", availability: "full-time",
    compatibilityProfile: { vision: 85, skills: 92, values: 78, commitment: 95, communication: 88 },
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 2, userId: 2, displayName: "Marcus Webb",
    title: "Product Designer & Growth Strategist",
    bio: "Design-led product thinker with a track record of scaling products from 0 to 100k users.",
    avatar: "/avatar-founder-2.jpg", location: "New York, NY",
    skills: ["Product Design", "Figma", "Growth Hacking", "Analytics", "Marketing", "User Research"],
    lookingFor: "Technical co-founder who can build fast and iterate",
    startupIdea: "A community-driven marketplace connecting indie makers with early adopters, featuring built-in feedback loops and viral growth mechanics.",
    experienceLevel: "expert", availability: "full-time",
    compatibilityProfile: { vision: 78, skills: 88, values: 82, commitment: 90, communication: 85 },
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 3, userId: 3, displayName: "Priya Sharma",
    title: "Backend Engineer & Systems Architect",
    bio: "Distributed systems specialist with experience at Google and Stripe.",
    avatar: "/avatar-founder-3.jpg", location: "Seattle, WA",
    skills: ["Go", "Rust", "Kubernetes", "Distributed Systems", "Kafka", "gRPC"],
    lookingFor: "Frontend-focused co-founder with an eye for design",
    startupIdea: "Real-time collaboration platform for engineering teams with intelligent code review automation and seamless CI/CD integrations.",
    experienceLevel: "expert", availability: "full-time",
    compatibilityProfile: { vision: 72, skills: 96, values: 88, commitment: 92, communication: 80 },
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 4, userId: 4, displayName: "James Okoro",
    title: "Mobile Developer & UX Researcher",
    bio: "iOS and Android developer with a psychology background. Obsessed with creating delightful mobile experiences.",
    avatar: "/avatar-founder-4.jpg", location: "Austin, TX",
    skills: ["Swift", "Kotlin", "Flutter", "Firebase", "UX Research", "Prototyping"],
    lookingFor: "Business-oriented co-founder with fundraising experience",
    startupIdea: "Mental wellness app that combines guided journaling with AI-powered mood tracking and personalized therapist matching.",
    experienceLevel: "intermediate", availability: "full-time",
    compatibilityProfile: { vision: 88, skills: 75, values: 85, commitment: 88, communication: 92 },
    createdAt: new Date(), updatedAt: new Date(),
  },
];

export default function Discover() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [cardStack, setCardStack] = useState<Profile[]>(demoProfiles);
  const [swipedIds, setSwipedIds] = useState<number[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [analyzeProfile, setAnalyzeProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const swipeMutation = trpc.swipe.create.useMutation({
    onSuccess: (data) => {
      if (data.isMatch && data.match && cardStack.length > 0) {
        setMatchedProfile(cardStack[0]);
        setShowMatch(true);
      }
      // Refresh matches list if we got a match
      if (data.isMatch) {
        utils.match.list.invalidate();
      }
    },
    onError: (err) => {
      setError(err.message);
      // Auto-dismiss after 3 seconds
      setTimeout(() => setError(null), 3000);
    },
  });

  // Fetch real profiles when authenticated (always enabled)
  const { data: discoverProfiles } = trpc.profile.discover.useQuery(
    { excludedUserIds: swipedIds, limit: 10 },
    { enabled: isAuthenticated && swipedIds.length >= 0 }
  );

  // Merge API profiles when they arrive
  const allProfiles = isAuthenticated && discoverProfiles
    ? [...cardStack, ...discoverProfiles.filter(dp => !cardStack.some(c => c.id === dp.id) && !swipedIds.includes(dp.userId))]
    : cardStack;

  const handleSwipe = (direction: "left" | "right") => {
    if (allProfiles.length === 0) return;

    const topCard = allProfiles[0];
    setSwipedIds((prev) => [...prev, topCard.userId]);
    setError(null);

    if (direction === "right" && isAuthenticated) {
      swipeMutation.mutate({ swipedId: topCard.userId, direction: "right" });
    }

    setTimeout(() => {
      setCardStack((prev) => prev.filter((p) => p.userId !== topCard.userId));
    }, 300);
  };

  const handleAnalyze = () => {
    if (allProfiles.length > 0) {
      setAnalyzeProfile(allProfiles[0]);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050009] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7F00FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050009] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles size={24} className="text-[#E100FF]" />
          <h1 className="text-xl font-bold gradient-text">SyndiAI</h1>
        </div>
      </header>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mx-6 mb-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        <div className="relative w-full max-w-md aspect-[3/4]" style={{ perspective: "1000px" }}>
          <AnimatePresence mode="popLayout">
            {allProfiles.length > 0 ? (
              allProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className="absolute inset-0"
                  style={{
                    zIndex: allProfiles.length - index,
                    transform:
                      index === 0
                        ? "rotateX(0deg) scale(1)"
                        : index === 1
                          ? "rotateX(5deg) scale(0.95)"
                          : "rotateX(10deg) scale(0.90)",
                    opacity: index === 0 ? 1 : index === 1 ? 0.6 : 0.3,
                    transition: "transform 0.3s ease, opacity 0.3s ease",
                  }}
                >
                  {index === 0 ? (
                    <SwipeCard
                      profile={profile}
                      isTop={true}
                      onSwipe={handleSwipe}
                      onAnalyze={handleAnalyze}
                    />
                  ) : (
                    <div className="w-full h-full rounded-3xl glass-card opacity-50" />
                  )}
                </div>
              ))
            ) : (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center glass-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Sparkles size={48} className="text-[#E100FF] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No More Profiles</h3>
                <p className="text-[#8E8E93] text-center px-8">Check back later for more potential co-founders!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {allProfiles.length > 0 && (
          <div className="flex items-center gap-6 mt-8">
            <motion.button
              onClick={() => handleSwipe("left")}
              className="w-16 h-16 rounded-full glass-surface flex items-center justify-center hover:bg-red-500/20 transition-colors border border-red-500/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} className="text-red-400" />
            </motion.button>
            <motion.button
              onClick={handleAnalyze}
              className="w-14 h-14 rounded-full glass-surface flex items-center justify-center hover:bg-[#7F00FF]/20 transition-colors border border-[#7F00FF]/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Sparkles size={22} className="text-[#E100FF]" />
            </motion.button>
            <motion.button
              onClick={() => handleSwipe("right")}
              className="w-16 h-16 rounded-full glass-surface flex items-center justify-center hover:bg-green-500/20 transition-colors border border-green-500/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Check size={28} className="text-green-400" />
            </motion.button>
          </div>
        )}
      </main>

      {/* Match Animation Overlay */}
      <AnimatePresence>
        {showMatch && matchedProfile && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMatch(false)}
          >
            <motion.div
              className="text-center p-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <div className="text-6xl mb-4">
                  <span className="gradient-text font-bold">It's a Match!</span>
                </div>
              </motion.div>
              <div className="flex justify-center gap-4 mb-6">
                <motion.div
                  className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#7F00FF] glow-shadow"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="You" className="w-full h-full object-cover bg-[#1a0523]" />
                </motion.div>
                <motion.div
                  className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#E100FF] glow-shadow"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <img src={matchedProfile.avatar || ""} alt={matchedProfile.displayName} className="w-full h-full object-cover" />
                </motion.div>
              </div>
              <p className="text-white/80 text-lg mb-2">You and {matchedProfile.displayName} matched!</p>
              <p className="text-[#8E8E93] text-sm mb-8">Start a conversation and build something amazing together.</p>
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => { setShowMatch(false); navigate("/matches"); }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-semibold glow-shadow-strong"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
                <motion.button
                  onClick={() => setShowMatch(false)}
                  className="px-8 py-3 rounded-full glass-surface text-white/70 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Keep Swiping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Analysis Modal */}
      {analyzeProfile && (
        <CompatibilityModal
          isOpen={!!analyzeProfile}
          onClose={() => setAnalyzeProfile(null)}
          targetUserId={analyzeProfile.userId}
          targetName={analyzeProfile.displayName}
        />
      )}

      <BottomNav />
    </div>
  );
}
