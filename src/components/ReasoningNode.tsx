import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

interface ReasoningNodeProps {
  node: {
    axis: string;
    axisColor: string;
    title: string;
    explanation: string;
    confidence: number;
  };
  index: number;
  show: boolean;
}

export default function ReasoningNode({ node, index, show }: ReasoningNodeProps) {
  const { displayedText, hasStarted, startTyping } = useTypewriter(
    node.explanation,
    20,
    index * 400
  );

  const [countedConfidence, setCountedConfidence] = useState(0);

  useEffect(() => {
    if (show) {
      startTyping();
    }
  }, [show, startTyping]);

  // Count up animation for confidence
  useEffect(() => {
    if (!hasStarted) return;

    const targetConfidence = node.confidence;
    const duration = 800;
    const steps = 30;
    const increment = targetConfidence / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetConfidence) {
        setCountedConfidence(targetConfidence);
        clearInterval(timer);
      } else {
        setCountedConfidence(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [hasStarted, node.confidence]);

  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.4 }}
    >
      {/* Header with glowing dot */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: node.axisColor,
            boxShadow: `0 0 8px ${node.axisColor}`,
          }}
        />
        <h3 className="font-mono-data text-sm text-white/80">{node.title}</h3>
      </div>

      {/* Explanation with typewriter effect */}
      <p className="text-sm text-[#8E8E93] leading-relaxed min-h-[60px]">
        {displayedText}
        {hasStarted && displayedText.length < node.explanation.length && (
          <span className="text-[#E100FF] animate-pulse">█</span>
        )}
      </p>

      {/* Confidence counter */}
      {hasStarted && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="font-mono-data text-xs text-[#8E8E93]">Confidence</span>
          <span
            className="font-mono-data text-sm font-semibold"
            style={{ color: node.axisColor }}
          >
            {countedConfidence}%
          </span>
        </div>
      )}
    </motion.div>
  );
}
