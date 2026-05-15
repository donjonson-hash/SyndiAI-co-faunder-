import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Brain, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our AI analyzes 5 key compatibility axes to find your ideal co-founder match.",
  },
  {
    icon: Users,
    title: "Swipe to Connect",
    description:
      "Browse founder profiles with an intuitive Tinder-like interface. Right swipe to match.",
  },
  {
    icon: Sparkles,
    title: "Deep Analysis",
    description:
      "Get detailed AI insights on vision alignment, skill complementarity, and values fit.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description:
      "Every profile is verified to ensure you're connecting with real founders.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050009] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(127,0,255,0.4) 0%, rgba(225,0,255,0.2) 50%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(225,0,255,0.5) 0%, transparent 70%)",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-[250px] h-[250px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(0,122,255,0.4) 0%, transparent 70%)",
            }}
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles size={16} className="text-[#E100FF]" />
            <span className="text-sm text-white/80">
              AI-Powered Co-Founder Matching
            </span>
          </motion.div>

          {/* Hero Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Find Your</span>
            <br />
            <span className="text-white">Perfect</span>{" "}
            <span className="gradient-text">Co-Founder</span>
          </h1>

          <p className="text-lg md:text-xl text-[#8E8E93] max-w-2xl mx-auto mb-10 leading-relaxed">
            SyndiAI uses intelligent analysis to match solo founders with
            complementary skills, aligned visions, and compatible work styles.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/discover">
              <motion.button
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-semibold text-lg glow-shadow-strong"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Discovering
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#E100FF]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Intelligent Matching</span>
            </h2>
            <p className="text-[#8E8E93] text-lg max-w-xl mx-auto">
              Every match is backed by deep AI analysis across five critical
              dimensions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#7F00FF] to-[#E100FF] flex items-center justify-center">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#8E8E93] text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-card p-12 glow-shadow"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Find Your{" "}
              <span className="gradient-text">Co-Founder?</span>
            </h2>
            <p className="text-[#8E8E93] text-lg mb-8 max-w-lg mx-auto">
              Join hundreds of founders who found their perfect match through
              SyndiAI.
            </p>
            <Link to="/discover">
              <motion.button
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-semibold text-lg mx-auto glow-shadow-strong"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#E100FF]" />
            <span className="font-semibold gradient-text">SyndiAI</span>
          </div>
          <p className="text-[#8E8E93] text-sm">
            Intelligent co-founder matching powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
