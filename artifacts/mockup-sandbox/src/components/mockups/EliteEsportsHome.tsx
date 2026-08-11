import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CircleHelp,
  Clock3,
  Gamepad2,
  Home,
  Info,
  LayoutGrid,
  LockKeyhole,
  Menu,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Trophy,
  UserRound,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type MatchMode = "Solo" | "Duo" | "Squad";
type Filter = "All" | MatchMode;

type Match = {
  id: number;
  game: "Free Fire" | "BGMI";
  mode: MatchMode;
  title: string;
  time: string;
  date: string;
  entry: number;
  prize: number;
  filled: number;
  total: number;
  tag: string;
  accent: string;
};

const matches: Match[] = [
  {
    id: 1,
    game: "Free Fire",
    mode: "Solo",
    title: "Clutch Circuit · Round 04",
    time: "Today, 8:30 PM",
    date: "Starts in 02h 14m",
    entry: 25,
    prize: 1800,
    filled: 36,
    total: 48,
    tag: "POPULAR",
    accent: "#ff5a1f",
  },
  {
    id: 2,
    game: "BGMI",
    mode: "Squad",
    title: "Night Ops: Erangel",
    time: "Today, 9:15 PM",
    date: "Starts in 02h 59m",
    entry: 99,
    prize: 6400,
    filled: 18,
    total: 25,
    tag: "HIGH PRIZE",
    accent: "#eaa842",
  },
  {
    id: 3,
    game: "Free Fire",
    mode: "Duo",
    title: "Neon Drop · Duo Clash",
    time: "Tomorrow, 7:00 PM",
    date: "Starts in 24h 44m",
    entry: 49,
    prize: 3200,
    filled: 22,
    total: 32,
    tag: "OPEN",
    accent: "#b7d2c0",
  },
  {
    id: 4,
    game: "BGMI",
    mode: "Solo",
    title: "Last Circle League",
    time: "Tomorrow, 10:30 PM",
    date: "Starts in 28h 14m",
    entry: 15,
    prize: 950,
    filled: 41,
    total: 50,
    tag: "LOW ENTRY",
    accent: "#ff7847",
  },
];

function Money({ value }: { value: number }) {
  return <span>₹{value.toLocaleString("en-IN")}</span>;
}

function GameMark({ game }: { game: Match["game"] }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        game === "Free Fire" ? "bg-[#ff5a1f]/15 text-[#ff7b43]" : "bg-[#e8b24b]/15 text-[#d99c2d]"
      }`}
    >
      <Gamepad2 size={19} strokeWidth={1.8} />
    </div>
  );
}

function MatchCard({
  match,
  onJoin,
  onRules,
  joined,
}: {
  match: Match;
  onJoin: (match: Match) => void;
  onRules: (match: Match) => void;
  joined: boolean;
}) {
  const percent = Math.round((match.filled / match.total) * 100);
  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-[#2c3338] bg-[#171b1e] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5a1f]/55 hover:bg-[#1b2023]">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#ff5a1f]/[0.06] blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <GameMark game={match.game} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#899096]">{match.game} / {match.mode}</p>
            <h3 className="mt-1 text-[15px] font-semibold tracking-[-0.02em] text-[#f6f2eb]">{match.title}</h3>
          </div>
        </div>
        <span className="rounded-md border border-[#394047] px-2 py-1 text-[9px] font-bold tracking-[0.12em] text-[#aab1b2]">{match.tag}</span>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-y-4 border-y border-[#2b3034] py-4 sm:grid-cols-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.13em] text-[#737c81]">Entry fee</p>
          <p className="mt-1 text-[15px] font-semibold text-[#f4efe8]"><Money value={match.entry} /></p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.13em] text-[#737c81]">Prize pool</p>
          <p className="mt-1 text-[15px] font-semibold text-[#f0b65c]"><Money value={match.prize} /></p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.13em] text-[#737c81]">Players</p>
          <p className="mt-1 text-[15px] font-semibold text-[#f4efe8]">{match.filled}<span className="text-[#737c81]">/{match.total}</span></p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.13em] text-[#737c81]">Start time</p>
          <p className="mt-1 text-[13px] font-semibold text-[#f4efe8]">{match.time}</p>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="text-[#8d969a]">{match.date}</span>
          <span className="font-semibold text-[#bdc3c2]">{percent}% filled</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#2a3033]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: match.accent }} />
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onJoin(match)}
          className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-[12px] font-bold transition-all duration-200 ${
            joined ? "bg-[#d9f1df] text-[#123d28]" : "bg-[#ff5a1f] text-[#1b1511] hover:bg-[#ff713c] active:scale-[0.98]"
          }`}
        >
          {joined ? <ShieldCheck size={15} /> : <Zap size={15} />}
          {joined ? "Spot reserved" : "Join match"}
        </button>
        <button type="button" onClick={() => onRules(match)} className="flex h-10 items-center gap-1.5 rounded-xl border border-[#394146] px-3 text-[11px] font-semibold text-[#b4bcbd] transition-colors hover:border-[#737b7e] hover:text-[#f4efe8]">
          <CircleHelp size={15} /> Rules
        </button>
      </div>
    </article>
  );
}

export function EliteEsportsHome() {
  const [filter, setFilter] = useState<Filter>("All");
  const [joined, setJoined] = useState<number[]>([]);
  const [activeNav, setActiveNav] = useState("Home");
  const [rulesMatch, setRulesMatch] = useState<Match | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleMatches = useMemo(
    () => (filter === "All" ? matches : matches.filter((match) => match.mode === filter)),
    [filter],
  );

  const handleJoin = (match: Match) => {
    if (joined.includes(match.id)) {
      setToast(`You're already in ${match.title}.`);
      return;
    }
    setJoined((current) => [...current, match.id]);
    setToast(`${match.title} is reserved for you. Entry fee: ₹${match.entry}.`);
  };

  return (
    <div className="min-h-screen bg-[#0d1012] text-[#f4efe8]" style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[236px] shrink-0 flex-col border-r border-[#262c30] bg-[#121619] px-5 py-7 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <img src="/__mockup/images/elite-esports-icon.png" alt="Elite eSports" className="h-9 w-9 rounded-lg object-cover" />
            <div><p className="text-[15px] font-extrabold tracking-[-0.05em]">ELITE</p><p className="text-[9px] font-bold tracking-[0.24em] text-[#ff6430]">ESPORTS</p></div>
          </div>
          <div className="mt-12 space-y-1">
            {[
              { label: "Home", icon: Home },
              { label: "My matches", icon: Trophy },
              { label: "Leaderboard", icon: LayoutGrid },
            ].map(({ label, icon: Icon }) => (
              <button key={label} type="button" onClick={() => setActiveNav(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold transition-colors ${activeNav === label ? "bg-[#ff5a1f]/12 text-[#ff7040]" : "text-[#858e92] hover:bg-[#1c2225] hover:text-[#e7e1d9]"}`}>
                <Icon size={17} strokeWidth={activeNav === label ? 2.3 : 1.8} /> {label}
                {label === "My matches" && joined.length > 0 && <span className="ml-auto rounded-full bg-[#ff5a1f] px-1.5 py-0.5 text-[9px] text-[#1d1410]">{joined.length}</span>}
              </button>
            ))}
          </div>
          <div className="mt-auto rounded-2xl border border-[#2c3438] bg-[#191e21] p-4">
            <div className="flex items-center gap-2 text-[#f0b65c]"><ShieldCheck size={15} /><span className="text-[10px] font-bold uppercase tracking-[0.12em]">Fair play first</span></div>
            <p className="mt-2 text-[11px] leading-5 text-[#858e92]">Verified matches. Protected entries. Clear payouts.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[76px] items-center justify-between border-b border-[#262c30] px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <Menu size={20} className="text-[#bbc0bd]" />
              <img src="/__mockup/images/elite-esports-icon.png" alt="" className="h-8 w-8 rounded-lg object-cover" />
            </div>
            <div className="hidden text-[11px] font-semibold text-[#778084] sm:block"><span className="text-[#a9b0ae]">Arena</span><ChevronRight className="mx-2 inline" size={13} /> Home</div>
            <div className="ml-auto flex items-center gap-3">
              <button type="button" onClick={() => setToast("Wallet is ready. Add funds before your next entry.")} className="flex items-center gap-2 rounded-xl border border-[#353d40] bg-[#171c1f] px-3 py-2 text-left transition-colors hover:border-[#ff5a1f]/60">
                <WalletCards size={16} className="text-[#ff7040]" /><span className="hidden text-[11px] font-semibold text-[#aeb5b3] sm:block">Wallet</span><span className="text-[13px] font-bold text-[#f3eee6]">₹1,240</span><Plus size={14} className="text-[#8a9497]" />
              </button>
              <button type="button" onClick={() => setActiveNav("Profile")} className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-colors hover:border-[#343c40]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d8a04f] text-[11px] font-extrabold text-[#281c12]">RS</span><span className="hidden text-left sm:block"><span className="block text-[11px] font-bold text-[#ebe5dd]">Rohan Shah</span><span className="block text-[9px] text-[#7e898c]">Level 18 · 1,840 XP</span></span>
              </button>
              <button type="button" onClick={() => setToast("You're all caught up.")} aria-label="Notifications" className="relative rounded-lg p-2 text-[#879194] hover:bg-[#1c2225] hover:text-[#f2eee7]"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" /></button>
            </div>
          </header>

          <div className="mx-auto max-w-[1160px] px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
            <section className="relative overflow-hidden rounded-[26px] border border-[#3a2a24] bg-[#1c1715] px-6 py-7 sm:px-9 sm:py-9">
              <div className="absolute -right-12 -top-28 h-80 w-80 rounded-full bg-[#ff5a1f]/10 blur-3xl" />
              <div className="relative max-w-[650px]">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#60402f] bg-[#2c211c] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e7a06e]"><span className="h-1.5 w-1.5 rounded-full bg-[#ff6731]" /> Live arena</div>
                <h1 className="max-w-[500px] text-3xl font-extrabold leading-[1.08] tracking-[-0.06em] text-[#faf5ed] sm:text-[42px]">Your next win starts<br className="hidden sm:block" /> with the right match.</h1>
                <p className="mt-4 max-w-[460px] text-[13px] leading-6 text-[#a89d94]">Skill-based rooms. Transparent payouts. No luck, no noise — just your game.</p>
                <div className="mt-7 flex flex-wrap gap-7">
                  <div><p className="text-[10px] uppercase tracking-[0.15em] text-[#887b73]">This month</p><p className="mt-1 text-xl font-bold text-[#f0b65c]">₹4,860 <span className="text-[11px] font-semibold text-[#93ae9e]">+18.4%</span></p></div>
                  <div className="border-l border-[#4b362c] pl-7"><p className="text-[10px] uppercase tracking-[0.15em] text-[#887b73]">Matches played</p><p className="mt-1 text-xl font-bold text-[#f4efe8]">27 <span className="text-[11px] font-semibold text-[#887e77]">this season</span></p></div>
                </div>
              </div>
              <div className="absolute bottom-0 right-8 hidden h-[150px] w-[205px] rotate-[-7deg] opacity-80 md:block">
                <div className="absolute right-0 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full border border-[#ff5a1f]/30" /><div className="absolute right-7 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border border-[#ffb286]/30" />
                <Zap className="absolute right-12 top-12 text-[#ff5a1f]" size={65} strokeWidth={1.1} />
              </div>
            </section>

            <section className="mt-9">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff7040]">Find your edge</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-[#f2eee7]">Open matches</h2><p className="mt-1 text-[12px] text-[#7d878b]">Pick a room, lock your entry, play for the pool.</p></div>
                <button type="button" onClick={() => setToast("Filters are ready for your next match.")} className="flex items-center gap-2 self-start rounded-lg border border-[#30383c] px-3 py-2 text-[11px] font-semibold text-[#9da6a5] transition-colors hover:border-[#596266] hover:text-[#eee8e0] sm:self-auto"><SlidersHorizontal size={14} /> More filters</button>
              </div>
              <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[#252c30] pb-px">
                {(["All", "Solo", "Duo", "Squad"] as Filter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`relative shrink-0 px-3 pb-3 text-[12px] font-bold transition-colors ${filter === item ? "text-[#ff7040]" : "text-[#7c878b] hover:text-[#d6d1c9]"}`}>{item}{filter === item && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#ff5a1f]" />}</button>)}
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {visibleMatches.map((match) => <MatchCard key={match.id} match={match} joined={joined.includes(match.id)} onJoin={handleJoin} onRules={setRulesMatch} />)}
                {visibleMatches.length === 0 && <div className="rounded-2xl border border-dashed border-[#394146] py-14 text-center text-sm text-[#899296]">No {filter.toLowerCase()} rooms are open right now.</div>}
              </div>
            </section>
          </div>
        </main>
      </div>

      <nav className="sticky bottom-0 z-20 flex border-t border-[#292f33] bg-[#121619]/95 px-4 py-3 backdrop-blur lg:hidden">
        {[{ label: "Home", icon: Home }, { label: "Matches", icon: Trophy }, { label: "Wallet", icon: WalletCards }, { label: "Profile", icon: UserRound }].map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => label === "Wallet" ? setToast("Wallet balance: ₹1,240") : setActiveNav(label === "Matches" ? "My matches" : label)} className={`flex flex-1 flex-col items-center gap-1 text-[9px] font-bold ${activeNav === (label === "Matches" ? "My matches" : label) ? "text-[#ff7040]" : "text-[#7d878b]"}`}><Icon size={18} /><span>{label}</span></button>)}
      </nav>

      {toast && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[#4c3d34] bg-[#211b18] px-4 py-3 text-[11px] font-semibold text-[#f0e8de] shadow-2xl"><ShieldCheck size={16} className="text-[#9fd4ad]" />{toast}<button type="button" onClick={() => setToast("")} aria-label="Dismiss"><X size={14} className="ml-2 text-[#8e9694]" /></button></div>}

      {rulesMatch && <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#07090a]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setRulesMatch(null)}>
        <div className="w-full max-w-[490px] rounded-t-[26px] border border-[#3a4245] bg-[#181d20] p-6 shadow-2xl sm:rounded-[26px]" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">Room rules</p><h2 className="mt-2 text-xl font-bold tracking-[-0.04em] text-[#f5f0e8]">{rulesMatch.title}</h2><p className="mt-1 text-[11px] text-[#8b9698]">{rulesMatch.game} · {rulesMatch.mode} · Entry ₹{rulesMatch.entry}</p></div><button type="button" onClick={() => setRulesMatch(null)} className="rounded-lg p-2 text-[#8c9697] hover:bg-[#252c30] hover:text-white"><X size={18} /></button></div>
          <div className="mt-6 space-y-3">{["Room ID and password are shared 10 minutes before start.", "No teaming, emulators, or modified clients. Fair play is monitored.", "Top placements are paid to your Elite wallet within 30 minutes.", "Entry fees are non-refundable once the room is locked."].map((rule, index) => <div key={rule} className="flex gap-3 rounded-xl border border-[#2b3336] bg-[#131719] p-3 text-[12px] leading-5 text-[#b5bcbb]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f]/15 text-[10px] font-bold text-[#ff7848]">{index + 1}</span>{rule}</div>)}</div>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#1f2b24] p-3 text-[11px] text-[#a9c8b0]"><LockKeyhole size={15} /> Your entry and payout are protected by Elite match verification.</div>
        </div>
      </div>}
    </div>
  );
}

export default EliteEsportsHome;