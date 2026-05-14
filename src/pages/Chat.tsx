import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { trpc } from "@/providers/trpc";

const demoMessages = [
  { id: 1, matchId: 1, senderId: 1, content: "Hey Marcus! Your profile caught my eye. The community marketplace idea sounds fascinating. I'd love to hear more about your vision!", status: "read" as const, createdAt: new Date(Date.now() - 7200000) },
  { id: 2, matchId: 1, senderId: 2, content: "Thanks Sarah! I'm really excited about the potential. Your AI background could be huge for personalization. Want to jump on a call this week?", status: "read" as const, createdAt: new Date(Date.now() - 5400000) },
  { id: 3, matchId: 1, senderId: 1, content: "Absolutely! How about Thursday afternoon? I have some ideas about integrating LLMs for user matching that I think you'll love.", status: "sent" as const, createdAt: new Date(Date.now() - 3600000) },
];

const matchInfo = {
  otherProfile: { displayName: "Marcus Webb", title: "Product Designer & Growth Strategist", avatar: "/avatar-founder-2.jpg" },
  synergyScore: 87,
};

const icebreakers = [
  "What's the biggest challenge you're facing with your startup right now?",
  "If you could have any superpower for your startup, what would it be?",
  "What's your ideal co-founder working style?",
  "How do you handle disagreements about product direction?",
];

export default function Chat() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const matchIdNum = parseInt(matchId || "0", 10);

  const { data: apiMessages } = trpc.match.messages.useQuery(
    { matchId: matchIdNum },
    { enabled: matchIdNum > 0 }
  );

  const utils = trpc.useUtils();
  const sendMutation = trpc.match.sendMessage.useMutation({
    onSuccess: () => {
      utils.match.messages.invalidate({ matchId: matchIdNum });
      utils.match.list.invalidate();
      setMessage("");
      setSendError(null);
    },
    onError: (err) => {
      setSendError(err.message);
      setTimeout(() => setSendError(null), 4000);
    },
  });

  const messages = apiMessages ?? demoMessages;
  const currentUserId = 1;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || matchIdNum <= 0) return;
    setSendError(null);
    sendMutation.mutate({ matchId: matchIdNum, content: message.trim() });
  };

  const handleIcebreaker = (text: string) => {
    if (matchIdNum <= 0) return;
    setSendError(null);
    sendMutation.mutate({ matchId: matchIdNum, content: text });
    setShowIcebreakers(false);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#050009] flex flex-col">
      {/* Header */}
      <header className="glass-surface px-4 py-3 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate("/matches")} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src={matchInfo.otherProfile.avatar} alt={matchInfo.otherProfile.displayName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{matchInfo.otherProfile.displayName}</h3>
            <p className="text-[#8E8E93] text-xs">Synergy: <span className="text-[#E100FF] font-mono-data">{matchInfo.synergyScore}%</span></p>
          </div>
        </div>
        <button onClick={() => setShowIcebreakers(!showIcebreakers)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Sparkles size={20} className="text-[#E100FF]" />
        </button>
      </header>

      {/* Error Banner */}
      {sendError && (
        <motion.div className="mx-4 mt-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {sendError}
        </motion.div>
      )}

      {/* Icebreaker Suggestions */}
      {showIcebreakers && (
        <motion.div className="mx-4 mt-2 p-3 bg-[#0a0012] border border-white/5 rounded-2xl" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
          <p className="text-xs text-[#8E8E93] mb-2 flex items-center gap-1"><Sparkles size={12} className="text-[#E100FF]" />AI-powered icebreakers</p>
          <div className="flex flex-wrap gap-2">
            {icebreakers.map((q, i) => (
              <button key={i} onClick={() => handleIcebreaker(q)} className="px-3 py-2 text-xs rounded-xl glass-surface text-white/80 hover:bg-white/10 transition-colors text-left">{q}</button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* AI Assistant Banner */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#1a0523]/50 border border-[#7F00FF]/20 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7F00FF] to-[#E100FF] flex items-center justify-center flex-shrink-0">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#E100FF] mb-1">SyndiAI Assistant</p>
            <p className="text-xs text-[#8E8E93]">Based on your profiles, you both share interests in AI-powered products and have complementary skills. Try discussing a potential MVP approach!</p>
          </div>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <motion.div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`max-w-[75%] ${isMe ? "bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white rounded-2xl rounded-br-md" : "glass-surface text-white/90 rounded-2xl rounded-bl-md"} px-4 py-3`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-[#8E8E93]"}`}>{formatTime(msg.createdAt)}</p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="px-4 py-3 glass-surface">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#7F00FF]/50 transition-colors"
          />
          <motion.button
            onClick={handleSend}
            disabled={sendMutation.isPending || !message.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] flex items-center justify-center flex-shrink-0 disabled:opacity-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sendMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} className="text-white" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
