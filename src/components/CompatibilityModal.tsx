import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { X, Brain } from "lucide-react";
import { trpc } from "@/providers/trpc";
import ReasoningNode from "./ReasoningNode";

interface CompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: number;
  targetName: string;
}

export default function CompatibilityModal({
  isOpen,
  onClose,
  targetUserId,
  targetName,
}: CompatibilityModalProps) {
  const { data: analysis, isLoading } = trpc.match.analyze.useQuery(
    { targetUserId },
    { enabled: isOpen && !!targetUserId }
  );

  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowReasoning(false);
      const timer = setTimeout(() => setShowReasoning(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const radarData = analysis
    ? [
        {
          axis: "Vision & Goals",
          score: analysis.breakdown.vision,
          fullMark: 100,
        },
        {
          axis: "Commitment",
          score: analysis.breakdown.commitment,
          fullMark: 100,
        },
        {
          axis: "Communication",
          score: analysis.breakdown.communication,
          fullMark: 100,
        },
        {
          axis: "Values & Culture",
          score: analysis.breakdown.values,
          fullMark: 100,
        },
        {
          axis: "Skills",
          score: analysis.breakdown.skills,
          fullMark: 100,
        },
      ]
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a0012] rounded-t-3xl border border-white/10 overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Brain size={24} className="text-[#E100FF]" />
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    AI Co-Founder Analysis
                  </h2>
                  <p className="text-sm text-[#8E8E93]">
                    Compatibility with {targetName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-[#8E8E93]" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-[#7F00FF] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : analysis ? (
                <>
                  {/* Synergy Score */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#7F00FF] to-[#E100FF] mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 200,
                        delay: 0.2,
                      }}
                    >
                      <motion.span
                        className="text-4xl font-bold text-white font-mono-data"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {analysis.overall}%
                      </motion.span>
                    </motion.div>
                    <p className="text-sm text-[#8E8E93]">Synergy Score</p>
                  </div>

                  {/* Radar Chart */}
                  <div className="w-full h-80 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid
                          stroke="rgba(142, 142, 147, 0.2)"
                          strokeWidth={1}
                        />
                        <PolarAngleAxis
                          dataKey="axis"
                          tick={{ fill: "#8E8E93", fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name="Compatibility"
                          dataKey="score"
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          fill="url(#radarGradient)"
                          fillOpacity={0.4}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        />
                        <defs>
                          <linearGradient
                            id="radarGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#7F00FF" />
                            <stop offset="100%" stopColor="#E100FF" />
                          </linearGradient>
                        </defs>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Reasoning Nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysis.reasoning.map((node, index) => (
                      <ReasoningNode
                        key={node.axis}
                        node={node}
                        index={index}
                        show={showReasoning}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-[#8E8E93]">
                  Complete your profile to see AI analysis.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
