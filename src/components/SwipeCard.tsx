import { motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { MapPin, Briefcase, Zap } from "lucide-react";
import type { Profile } from "@db/schema";

interface SwipeCardProps {
  profile: Profile;
  isTop: boolean;
  onSwipe: (direction: "left" | "right") => void;
  onAnalyze: () => void;
  style?: React.CSSProperties;
}

export default function SwipeCard({
  profile,
  isTop,
  onSwipe,
  onAnalyze,
  style,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const opacityLeft = useTransform(x, [-200, -50], [1, 0]);
  const opacityRight = useTransform(x, [50, 200], [0, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 150) {
      onSwipe("right");
    } else if (info.offset.x < -150) {
      onSwipe("left");
    }
  };

  const skills = profile.skills || [];

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
        zIndex: isTop ? 3 : 1,
        ...style,
      }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card glow-shadow">
        {/* Background Image */}
        <div className="absolute inset-0">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7F00FF] to-[#E100FF]" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050009] via-[#050009]/60 to-transparent" />
        </div>

        {/* Swipe indicators */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-8 left-8 border-4 border-green-500 rounded-xl px-4 py-2"
              style={{ opacity: opacityRight }}
            >
              <span className="text-green-500 text-2xl font-bold tracking-wider">
                MATCH
              </span>
            </motion.div>
            <motion.div
              className="absolute top-8 right-8 border-4 border-red-500 rounded-xl px-4 py-2"
              style={{ opacity: opacityLeft }}
            >
              <span className="text-red-500 text-2xl font-bold tracking-wider">
                PASS
              </span>
            </motion.div>
          </>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* AI Analyze button */}
          {isTop && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze();
              }}
              className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full glass-surface text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={16} className="text-[#E100FF]" />
              <span>AI Analysis</span>
            </motion.button>
          )}

          <h2 className="text-3xl font-bold text-white mb-1">
            {profile.displayName}
          </h2>

          {profile.title && (
            <p className="text-[#8E8E93] text-sm mb-3">{profile.title}</p>
          )}

          <div className="flex flex-wrap gap-3 mb-4">
            {profile.location && (
              <div className="flex items-center gap-1 text-[#8E8E93] text-xs">
                <MapPin size={14} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.experienceLevel && (
              <div className="flex items-center gap-1 text-[#8E8E93] text-xs">
                <Briefcase size={14} />
                <span className="capitalize">{profile.experienceLevel}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80 border border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {profile.startupIdea && (
            <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
              {profile.startupIdea}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
