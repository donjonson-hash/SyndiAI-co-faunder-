import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Zap,
  Edit3,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";

// Demo profile for non-authenticated users
const demoProfile = {
  id: 1,
  userId: 1,
  displayName: "Demo User",
  title: "Aspiring Founder",
  bio: "Passionate about building products that make a difference. Looking for a technical co-founder to bring my vision to life.",
  avatar: null,
  location: "San Francisco, CA",
  skills: ["Product Management", "Marketing", "Sales"],
  lookingFor: "Technical co-founder",
  startupIdea: "A platform that connects freelancers with long-term project opportunities, using AI to match skills with company culture fit.",
  experienceLevel: "intermediate",
  availability: "full-time",
  compatibilityProfile: { vision: 75, skills: 60, values: 80, commitment: 90, communication: 85 },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: apiProfile } = trpc.profile.me.useQuery();

  const profile = apiProfile ?? demoProfile;
  const skills = profile.skills || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#050009] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-[#E100FF]" />
            <h1 className="text-xl font-bold gradient-text">SyndiAI</h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => navigate("/profile/edit")}
              className="p-2 rounded-full glass-surface hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 size={18} className="text-white" />
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="p-2 rounded-full glass-surface hover:bg-red-500/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <LogOut size={18} className="text-red-400" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="flex-1 px-4 pb-32 overflow-y-auto">
        {/* Profile Card */}
        <motion.div
          className="glass-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#7F00FF] to-[#E100FF] flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={36} className="text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {profile.displayName}
              </h2>
              {profile.title && (
                <p className="text-[#8E8E93] text-sm">{profile.title}</p>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {profile.location && (
              <div className="flex items-center gap-2 text-[#8E8E93] text-sm">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.experienceLevel && (
              <div className="flex items-center gap-2 text-[#8E8E93] text-sm">
                <Briefcase size={16} />
                <span className="capitalize">{profile.experienceLevel}</span>
              </div>
            )}
            {profile.availability && (
              <div className="flex items-center gap-2 text-[#8E8E93] text-sm">
                <Zap size={16} />
                <span className="capitalize">{profile.availability}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">About</h3>
              <p className="text-[#8E8E93] text-sm leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-white/80 border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Looking For */}
          {profile.lookingFor && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                Looking For
              </h3>
              <p className="text-[#8E8E93] text-sm">{profile.lookingFor}</p>
            </div>
          )}

          {/* Startup Idea */}
          {profile.startupIdea && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Startup Idea
              </h3>
              <p className="text-[#8E8E93] text-sm leading-relaxed">
                {profile.startupIdea}
              </p>
            </div>
          )}
        </motion.div>

        {/* Compatibility Profile Card */}
        {profile.compatibilityProfile && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-white mb-4">
              AI Compatibility Profile
            </h3>
            <div className="space-y-3">
              {Object.entries(profile.compatibilityProfile).map(
                ([key, value]) => {
                  const colors: Record<string, string> = {
                    vision: "#007AFF",
                    skills: "#FF9500",
                    values: "#AF52DE",
                    commitment: "#FF3B30",
                    communication: "#34C759",
                  };
                  const labels: Record<string, string> = {
                    vision: "Vision & Goals",
                    skills: "Skills",
                    values: "Values & Culture",
                    commitment: "Commitment",
                    communication: "Communication",
                  };
                  const color = colors[key] || "#7F00FF";
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#8E8E93]">
                          {labels[key] || key}
                        </span>
                        <span
                          className="text-xs font-mono-data font-semibold"
                          style={{ color }}
                        >
                          {value}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
