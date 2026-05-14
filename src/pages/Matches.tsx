import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import BottomNav from "@/components/BottomNav";

// Demo matches for non-authenticated users
const demoMatches = [
  {
    id: 1,
    synergyScore: 87,
    isNew: "false" as const,
    createdAt: new Date(Date.now() - 86400000),
    otherProfile: {
      id: 2,
      userId: 2,
      displayName: "Marcus Webb",
      title: "Product Designer & Growth Strategist",
      avatar: "/avatar-founder-2.jpg",
      location: "New York, NY",
      skills: ["Product Design", "Figma", "Growth Hacking"],
    },
    otherUser: {
      id: 2,
      name: "Marcus Webb",
      avatar: "/avatar-founder-2.jpg",
    },
    unreadCount: 1,
    lastMessage: {
      id: 3,
      matchId: 1,
      senderId: 1,
      content: "Absolutely! How about Thursday afternoon? I have some ideas about integrating LLMs for user matching that I think you'll love.",
      status: "sent" as const,
      createdAt: new Date(Date.now() - 3600000),
    },
  },
];

export default function Matches() {
  const navigate = useNavigate();
  const { data: apiMatches, isLoading } = trpc.match.list.useQuery();

  const matches = apiMatches ?? demoMatches;

  return (
    <div className="min-h-screen bg-[#050009] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={24} className="text-[#E100FF]" />
          <h1 className="text-2xl font-bold gradient-text">SyndiAI</h1>
        </div>
        <h2 className="text-xl font-semibold text-white">Your Matches</h2>
        <p className="text-[#8E8E93] text-sm">
          Founders who swiped right on you too
        </p>
      </header>

      {/* Matches List */}
      <main className="flex-1 px-4 pb-32 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7F00FF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full glass-surface flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-[#8E8E93]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No Matches Yet
            </h3>
            <p className="text-[#8E8E93] max-w-xs">
              Start swiping right on founders you like. When they swipe right
              back, you'll match!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 mt-4">
            {matches.map((match, index) => (
              <motion.button
                key={match.id}
                className="w-full text-left glass-card p-4 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/chat/${match.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden">
                      <img
                        src={match.otherProfile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + match.otherUser?.name}
                        alt={match.otherProfile?.displayName || "Match"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {match.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {match.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {match.otherProfile?.displayName || match.otherUser?.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="font-mono-data text-xs text-[#E100FF]">
                          {match.synergyScore}%
                        </span>
                        <ChevronRight size={16} className="text-[#8E8E93]" />
                      </div>
                    </div>

                    <p className="text-[#8E8E93] text-sm truncate mb-1">
                      {match.otherProfile?.title}
                    </p>

                    {match.lastMessage && (
                      <p className="text-[#8E8E93] text-xs truncate">
                        {match.lastMessage.content.slice(0, 60)}
                        {match.lastMessage.content.length > 60 ? "..." : ""}
                      </p>
                    )}

                    {/* Skills */}
                    {match.otherProfile?.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(match.otherProfile.skills as string[]).slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-white/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
