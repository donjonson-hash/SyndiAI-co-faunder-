import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: existingProfile } = trpc.profile.me.useQuery();
  const createProfile = trpc.profile.create.useMutation({
    onSuccess: () => navigate("/profile"),
  });
  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => navigate("/profile"),
  });

  const [form, setForm] = useState({
    displayName: "",
    title: "",
    bio: "",
    location: "",
    skills: [] as string[],
    newSkill: "",
    lookingFor: "",
    startupIdea: "",
    experienceLevel: "intermediate" as "beginner" | "intermediate" | "expert",
    availability: "full-time" as "full-time" | "part-time" | "advisory",
  });

  useEffect(() => {
    if (existingProfile) {
      setForm({
        displayName: existingProfile.displayName || "",
        title: existingProfile.title || "",
        bio: existingProfile.bio || "",
        location: existingProfile.location || "",
        skills: (existingProfile.skills as string[]) || [],
        newSkill: "",
        lookingFor: existingProfile.lookingFor || "",
        startupIdea: existingProfile.startupIdea || "",
        experienceLevel:
          (existingProfile.experienceLevel as "beginner" | "intermediate" | "expert") ||
          "intermediate",
        availability:
          (existingProfile.availability as "full-time" | "part-time" | "advisory") ||
          "full-time",
      });
    }
  }, [existingProfile]);

  const handleAddSkill = () => {
    if (form.newSkill.trim() && !form.skills.includes(form.newSkill.trim())) {
      setForm({
        ...form,
        skills: [...form.skills, form.newSkill.trim()],
        newSkill: "",
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = () => {
    const data = {
      displayName: form.displayName,
      title: form.title || undefined,
      bio: form.bio || undefined,
      location: form.location || undefined,
      skills: form.skills.length > 0 ? form.skills : undefined,
      lookingFor: form.lookingFor || undefined,
      startupIdea: form.startupIdea || undefined,
      experienceLevel: form.experienceLevel,
      availability: form.availability,
    };

    if (existingProfile) {
      updateProfile.mutate(data);
    } else {
      createProfile.mutate(data);
    }
  };

  const isLoading = createProfile.isPending || updateProfile.isPending;

  return (
    <div className="min-h-screen bg-[#050009] flex flex-col">
      {/* Header */}
      <header className="glass-surface px-4 py-3 flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white flex-1">
          {existingProfile ? "Edit Profile" : "Create Profile"}
        </h1>
        <motion.button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white text-sm font-medium disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save size={16} />
          {isLoading ? "Saving..." : "Save"}
        </motion.button>
      </header>

      {/* Form */}
      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto pb-20">
        {/* Basic Info */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#8E8E93] mb-1 block">
                Display Name *
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50"
              />
            </div>
            <div>
              <label className="text-xs text-[#8E8E93] mb-1 block">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Full-Stack Developer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50"
              />
            </div>
            <div>
              <label className="text-xs text-[#8E8E93] mb-1 block">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell others about yourself..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50 resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#8E8E93] mb-1 block">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                placeholder="e.g. San Francisco, CA"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50"
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-4">Skills</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={form.newSkill}
              onChange={(e) =>
                setForm({ ...form, newSkill: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              placeholder="Add a skill"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50"
            />
            <motion.button
              onClick={handleAddSkill}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#7F00FF] to-[#E100FF] flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={18} className="text-white" />
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-white/5 text-white/80 border border-white/10"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Founder Info */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-4">
            Founder Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#8E8E93] mb-1 block">
                Looking For
              </label>
              <input
                type="text"
                value={form.lookingFor}
                onChange={(e) =>
                  setForm({ ...form, lookingFor: e.target.value })
                }
                placeholder="e.g. Technical co-founder"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50"
              />
            </div>
            <div>
              <label className="text-xs text-[#8E8E93] mb-1 block">
                Startup Idea
              </label>
              <textarea
                value={form.startupIdea}
                onChange={(e) =>
                  setForm({ ...form, startupIdea: e.target.value })
                }
                placeholder="Describe your startup idea..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8E8E93] mb-1 block">
                  Experience
                </label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      experienceLevel: e.target.value as
                        | "beginner"
                        | "intermediate"
                        | "expert",
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7F00FF]/50 appearance-none"
                >
                  <option value="beginner" className="bg-[#1a0523]">
                    Beginner
                  </option>
                  <option value="intermediate" className="bg-[#1a0523]">
                    Intermediate
                  </option>
                  <option value="expert" className="bg-[#1a0523]">
                    Expert
                  </option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8E8E93] mb-1 block">
                  Availability
                </label>
                <select
                  value={form.availability}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      availability: e.target.value as
                        | "full-time"
                        | "part-time"
                        | "advisory",
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7F00FF]/50 appearance-none"
                >
                  <option value="full-time" className="bg-[#1a0523]">
                    Full-time
                  </option>
                  <option value="part-time" className="bg-[#1a0523]">
                    Part-time
                  </option>
                  <option value="advisory" className="bg-[#1a0523]">
                    Advisory
                  </option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
