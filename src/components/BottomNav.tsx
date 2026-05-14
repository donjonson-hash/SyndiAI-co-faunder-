import { Link, useLocation } from "react-router";
import { Flame, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/discover", icon: Flame, label: "Discover" },
  { path: "/matches", icon: MessageCircle, label: "Matches" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-surface rounded-full px-6 py-3 flex items-center gap-2 glow-shadow">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <item.icon
                size={20}
                className={`relative z-10 transition-colors ${
                  isActive ? "text-white" : "text-[#8E8E93]"
                }`}
              />
              <span
                className={`relative z-10 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-[#8E8E93]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
