// AI Matching Engine — deterministic compatibility calculator
// All scores are hash-based: same profiles always produce same results.

interface CompatibilityProfile {
  vision: number;
  skills: number;
  values: number;
  commitment: number;
  communication: number;
}

interface FounderProfile {
  skills?: string[] | null;
  lookingFor?: string | null;
  startupIdea?: string | null;
  experienceLevel?: string | null;
  availability?: string | null;
  compatibilityProfile?: CompatibilityProfile | null;
}

// ─── Deterministic hash ─────────────────────────────────────────
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h) / 0x7fffffff;
}

function seededRandom(seed: string, min: number, max: number): number {
  return Math.round(min + hashString(seed) * (max - min));
}

// ─── Compatibility Profile Generator ────────────────────────────
export function generateCompatibilityProfile(
  profile: FounderProfile
): CompatibilityProfile {
  if (profile.compatibilityProfile) {
    return profile.compatibilityProfile;
  }

  const skills = profile.skills || [];
  const idea = profile.startupIdea || "";
  const hasStartupIdea = idea.length > 20;
  const experienceLevel = profile.experienceLevel || "intermediate";
  const availability = profile.availability || "full-time";

  // Vision: based on idea clarity
  const visionSeed = idea.slice(0, 50) + "_vision";
  const vision = hasStartupIdea
    ? 60 + seededRandom(visionSeed, 0, 35)
    : seededRandom(visionSeed, 35, 65);

  // Skills: based on skill count
  const skillsSeed = (skills.sort().join(",") || "none") + "_skills";
  const skillsScore = Math.min(30 + skills.length * 12, 95);
  const skillsBonus = seededRandom(skillsSeed, -5, 5);

  // Values: derived from experience level
  const valuesMap: Record<string, number> = {
    beginner: 50,
    intermediate: 70,
    expert: 90,
  };
  const values = valuesMap[experienceLevel] || 60;

  // Commitment: derived from availability
  const commitmentMap: Record<string, number> = {
    "full-time": 90,
    "part-time": 65,
    advisory: 45,
  };
  const commitment = commitmentMap[availability] || 60;

  // Communication: based on bio/idea length
  const commSeed = (profile.lookingFor || "") + "_comm";
  const communication = seededRandom(commSeed, 55, 85);

  return {
    vision: Math.max(0, Math.min(100, vision)),
    skills: Math.max(0, Math.min(100, skillsScore + skillsBonus)),
    values: Math.max(0, Math.min(100, values)),
    commitment: Math.max(0, Math.min(100, commitment)),
    communication: Math.max(0, Math.min(100, communication)),
  };
}

// ─── Synergy Score Calculator ───────────────────────────────────
export function calculateSynergyScore(
  profileA: FounderProfile,
  profileB: FounderProfile
): {
  overall: number;
  breakdown: CompatibilityProfile;
  reasoning: ReasoningNode[];
} {
  const compatA = generateCompatibilityProfile(profileA);
  const compatB = generateCompatibilityProfile(profileB);

  const skillsA = new Set(profileA.skills || []);
  const skillsB = new Set(profileB.skills || []);
  const sharedSkills = [...skillsA].filter((s) => skillsB.has(s));
  const totalUniqueSkills = new Set([...skillsA, ...skillsB]).size;

  // Skills complementarity
  const skillOverlap =
    totalUniqueSkills > 0 ? sharedSkills.length / totalUniqueSkills : 0.5;
  const skillsComplementarity = Math.round(
    50 + (1 - skillOverlap) * 40 + skillOverlap * 10
  );

  // Vision alignment
  const visionAlignment = Math.round(
    100 - Math.abs(compatA.vision - compatB.vision)
  );

  // Values compatibility
  const valuesCompatibility = Math.round(
    100 - Math.abs(compatA.values - compatB.values) * 1.2
  );

  // Commitment match
  const commitmentMatch = Math.round(
    100 - Math.abs(compatA.commitment - compatB.commitment) * 1.5
  );

  // Communication compatibility
  const communicationCompat = Math.round(
    90 - Math.abs(compatA.communication - compatB.communication) * 0.8
  );

  const breakdown: CompatibilityProfile = {
    vision: Math.max(0, Math.min(100, visionAlignment)),
    skills: Math.max(0, Math.min(100, skillsComplementarity)),
    values: Math.max(0, Math.min(100, valuesCompatibility)),
    commitment: Math.max(0, Math.min(100, commitmentMatch)),
    communication: Math.max(0, Math.min(100, communicationCompat)),
  };

  const overall = Math.round(
    breakdown.vision * 0.25 +
      breakdown.skills * 0.25 +
      breakdown.values * 0.2 +
      breakdown.commitment * 0.15 +
      breakdown.communication * 0.15
  );

  const reasoning = generateReasoning(
    profileA,
    profileB,
    breakdown,
    sharedSkills,
    totalUniqueSkills
  );

  return { overall, breakdown, reasoning };
}

export interface ReasoningNode {
  axis: string;
  axisColor: string;
  title: string;
  explanation: string;
  confidence: number;
}

function generateReasoning(
  profileA: FounderProfile,
  profileB: FounderProfile,
  breakdown: CompatibilityProfile,
  sharedSkills: string[],
  totalUniqueSkills: number
): ReasoningNode[] {
  const reasoning: ReasoningNode[] = [];

  const bothHaveIdeas =
    !!profileA.startupIdea &&
    profileA.startupIdea.length > 10 &&
    !!profileB.startupIdea &&
    profileB.startupIdea.length > 10;

  reasoning.push({
    axis: "vision",
    axisColor: "#007AFF",
    title: "Vision & Goals",
    explanation: bothHaveIdeas
      ? `Both founders have defined startup visions. ${breakdown.vision > 70 ? "Their goals show strong alignment in direction and market focus." : "While both have ideas, their visions may need reconciliation."}`
      : `One or both founders are still exploring ideas. This ${breakdown.vision > 60 ? "creates flexibility for co-creation" : "may indicate misaligned expectations"}.`,
    confidence: breakdown.vision,
  });

  const skillOverlapPct =
    totalUniqueSkills > 0
      ? Math.round((sharedSkills.length / totalUniqueSkills) * 100)
      : 0;

  reasoning.push({
    axis: "skills",
    axisColor: "#FF9500",
    title: "Complementary Skills",
    explanation:
      skillOverlapPct < 40
        ? `Excellent skill diversity! Only ${skillOverlapPct}% overlap means broad coverage across ${totalUniqueSkills} unique competencies.`
        : skillOverlapPct < 70
          ? `Moderate skill overlap at ${skillOverlapPct}%. Good balance of shared understanding and unique expertise.`
          : `High skill overlap at ${skillOverlapPct}%. Consider how roles will be divided.`,
    confidence: breakdown.skills,
  });

  const expA = profileA.experienceLevel || "intermediate";
  const expB = profileB.experienceLevel || "intermediate";

  reasoning.push({
    axis: "values",
    axisColor: "#AF52DE",
    title: "Values & Culture",
    explanation:
      expA === expB
        ? `Both founders are at similar experience levels (${expA}), suggesting aligned work culture and expectations.`
        : `Complementary experience levels: ${expA} + ${expB}. This creates mentorship opportunities and diverse perspectives.`,
    confidence: breakdown.values,
  });

  const availA = profileA.availability || "full-time";
  const availB = profileB.availability || "full-time";

  reasoning.push({
    axis: "commitment",
    axisColor: "#FF3B30",
    title: "Commitment & Risk",
    explanation:
      availA === availB
        ? `Both founders are ${availA === "full-time" ? "fully committed" : availA === "part-time" ? "part-time committed" : "in advisory roles"}. Aligned risk profiles.`
        : `Different commitment levels: ${availA} vs ${availB}. Establish clear expectations about time investment.`,
    confidence: breakdown.commitment,
  });

  reasoning.push({
    axis: "communication",
    axisColor: "#34C759",
    title: "Communication Style",
    explanation:
      breakdown.communication > 75
        ? "Strong communication compatibility predicted based on profile indicators."
        : breakdown.communication > 50
          ? "Moderate communication alignment. Consider discussing communication preferences early."
          : "Communication styles may differ. Proactive check-ins recommended.",
    confidence: breakdown.communication,
  });

  return reasoning;
}
