import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Clock3,
  Gamepad2,
  Home,
  LayoutGrid,
  LockKeyhole,
  Plus,
  ShieldCheck,
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
  countdown: string;
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
    countdown: "02h 14m",
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
    countdown: "02h 59m",
    entry: 99,
    prize: 6400,
    filled: 18,
    total: 25,
    tag: "HIGH PRIZE",
    accent: "#eab34d",
  },
  {
    id: 3,
    game: "Free Fire",
    mode: "Duo",
    title: "Neon Drop · Duo Clash",
    time: "Tomorrow, 7:00 PM",
    countdown: "24h 44m",
    entry: 49,
    prize: 3200,
    filled: 22,
    total: 32,
    tag: "OPEN",
    accent: "#8ec9a1",
  },
  {
    id: 4,
    game: "BGMI",
    mode: "Solo",
    title: "Last Circle League",
    time: "Tomorrow, 10:30 PM",
    countdown: "28h 14m",
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
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${
        game === "Free Fire"
          ? "bg-[#ff5a1f]/15 text-[#ff7b43]"
          : "bg-[#e8b24b]/15 text-[#e1ae42]"
      }`}
    >
      <Gamepad2 size={19} strokeWidth={1.8} />
    </div>
  );
}

function MatchCard({
  match,
  joined,
  onJoin,
  onRules,
}: {
  match: Match;
  joined: boolean;
  onJoin: (match: Match) => void;
  onRules: (match: Match) => void;
}) {
  const percent = Math.round((match.filled / match.total) * 100);

  return (
    <article className="overflow-hidden rounded-[21px] border border-[#2b3236] bg-[#171c1f] shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <GameMark game={match.game} />
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#808b8e]">
              {match.game} · {match.mode}
            </p>
            <h3 className="mt-1 truncate text-[14px] font-bold tracking-[-0.02em] text-[#f5f0e9]">
              {match.title}
            </h3>
          </div>
        </div>
        <span className="shrink-0 rounded-md border border-[#3b4448] px-2 py-1 text-[8px] font-bold tracking-[0.1em] text-[#aab2b2]">
          {match.tag}
        </span>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-3 border-y border-[#2a3034] py-3.5">
        <div>
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#747f83]">
            Entry
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#f3ede5]">
            <Money value={match.entry} />
          </p>
        </div>
        <div className="border-l border-[#30373a] pl-3.5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#747f83]">
            Prize pool
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#efb24f]">
            <Money value={match.prize} />
          </p>
        </div>
        <div className="border-l border-[#30373a] pl-3.5">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#747f83]">
            Players
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#f3ede5]">
            {match.filled}
            <span className="font-medium text-[#758084]">/{match.total}</span>
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1.5 text-[#9da5a4]">
            <Clock3 size={12} className="text-[#ff7140]" />
            {match.time}
          </span>
          <span className="font-semibold text-[#b7bfbd]">{percent}% filled</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2a3033]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: match.accent }}
          />
        </div>
        <p className="mt-2 text-[10px] text-[#7d898d]">
          Starts in <span className="font-semibold text-[#aeb7b5]">{match.countdown}</span>
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onJoin(match)}
            className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-[12px] font-bold transition active:scale-[0.98] ${
              joined
                ? "bg-[#d8efdd] text-[#17442d]"
                : "bg-[#ff5a1f] text-[#1a120e]"
            }`}
          >
            {joined ? <ShieldCheck size={15} /> : <Zap size={15} />}
            {joined ? "Spot reserved" : "Join match"}
          </button>
          <button
            type="button"
            onClick={() => onRules(match)}
            className="flex h-10 w-[76px] items-center justify-center gap-1.5 rounded-xl border border-[#3b4549] text-[11px] font-semibold text-[#b7c0bf] transition hover:border-[#727d80] hover:text-white"
          >
            <CircleHelp size={15} />
            Rules
          </button>
        </div>
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
    () =>
      filter === "All"
        ? matches
        : matches.filter((match) => match.mode === filter),
    [filter],
  );

  const handleJoin = (match: Match) => {
    if (joined.includes(match.id)) {
      setToast(`You're already in ${match.title}.`);
      return;
    }
    setJoined((current) => [...current, match.id]);
    setToast(`${match.title} reserved. Entry fee: ₹${match.entry}.`);
  };

  return (
    <div
      className="min-h-screen bg-[#0b0e10] text-[#f4efe8]"
      style={{
        fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#101416] shadow-2xl">
        <header className="flex h-[72px] items-center justify-between border-b border-[#252c30] px-5">
          <div className="flex items-center gap-2.5">
            <img
              src="/__mockup/images/elite-esports-icon.png"
              alt="Elite eSports"
              className="h-9 w-9 rounded-[11px] object-cover"
            />
            <div>
              <p className="text-[14px] font-extrabold tracking-[-0.06em] text-[#f4efe8]">
                ELITE
              </p>
              <p className="text-[8px] font-bold tracking-[0.25em] text-[#ff6531]">
                ESPORTS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setToast("Wallet balance: ₹1,240")}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-[#353e42] bg-[#171c1f] px-3 text-[12px] font-bold text-[#f3eee7]"
            >
              <WalletCards size={15} className="text-[#ff7040]" />
              ₹1,240
              <Plus size={13} className="text-[#879295]" />
            </button>
            <button
              type="button"
              onClick={() => setToast("No new notifications.")}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#9ca6a7] hover:bg-[#1c2326]"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
            </button>
          </div>
        </header>

        <main className="px-4 pb-28 pt-5">
          <section className="relative overflow-hidden rounded-[22px] border border-[#442c23] bg-[#211916] px-5 py-5">
            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#ff5a1f]/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#e7a16d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff6630]" />
                Live arena
              </div>
              <h1 className="mt-3 max-w-[275px] text-[27px] font-extrabold leading-[1.1] tracking-[-0.06em] text-[#fbf6ef]">
                Your next win starts with the right match.
              </h1>
              <p className="mt-3 max-w-[270px] text-[11px] leading-5 text-[#ac9e95]">
                Skill-based rooms. Transparent payouts. Just your game.
              </p>
              <div className="mt-5 flex items-center gap-5">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] text-[#8b7c73]">
                    This month
                  </p>
                  <p className="mt-1 text-[17px] font-bold text-[#efb24f]">
                    ₹4,860 <span className="text-[9px] text-[#90b399]">+18.4%</span>
                  </p>
                </div>
                <div className="h-8 w-px bg-[#4b362c]" />
                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] text-[#8b7c73]">
                    Matches
                  </p>
                  <p className="mt-1 text-[17px] font-bold text-[#f4efe8]">
                    27 <span className="text-[9px] font-medium text-[#8b817b]">season</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 right-5 flex h-[86px] w-[86px] items-center justify-center rounded-full border border-[#ff5a1f]/25">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#ffb286]/25">
                <Zap size={34} strokeWidth={1.2} className="text-[#ff5a1f]" />
              </div>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff7040]">
                  Find your edge
                </p>
                <h2 className="mt-1.5 text-[21px] font-bold tracking-[-0.05em] text-[#f4efe8]">
                  Open matches
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setToast("All rooms are verified before opening.")}
                className="flex items-center gap-1 text-[10px] font-bold text-[#8c9799]"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-4 flex gap-1 rounded-xl bg-[#171d20] p-1">
              {(["All", "Solo", "Duo", "Squad"] as Filter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`h-9 flex-1 rounded-lg text-[11px] font-bold transition ${
                    filter === item
                      ? "bg-[#ff5a1f] text-[#1b130f] shadow-[0_4px_12px_rgba(255,90,31,0.18)]"
                      : "text-[#7f8b8e] hover:text-[#e6e0d8]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3.5">
              {visibleMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  joined={joined.includes(match.id)}
                  onJoin={handleJoin}
                  onRules={setRulesMatch}
                />
              ))}
              {visibleMatches.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#394146] px-5 py-12 text-center text-sm text-[#899296]">
                  No {filter.toLowerCase()} rooms are open right now.
                </div>
              )}
            </div>
          </section>
        </main>

        <nav className="fixed bottom-0 left-1/2 z-20 flex h-[76px] w-full max-w-[430px] -translate-x-1/2 items-start border-t border-[#292f33] bg-[#121719]/95 px-3 pt-3 backdrop-blur-xl">
          {[
            { label: "Home", icon: Home },
            { label: "My matches", icon: Trophy },
            { label: "Leaderboard", icon: LayoutGrid },
            { label: "Profile", icon: UserRound },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveNav(label)}
              className={`flex flex-1 flex-col items-center gap-1 text-[9px] font-bold transition ${
                activeNav === label ? "text-[#ff7040]" : "text-[#7d888b]"
              }`}
            >
              <span
                className={`flex h-8 w-10 items-center justify-center rounded-xl ${
                  activeNav === label ? "bg-[#ff5a1f]/12" : ""
                }`}
              >
                <Icon size={18} strokeWidth={activeNav === label ? 2.4 : 1.8} />
              </span>
              {label === "My matches" ? "Matches" : label}
            </button>
          ))}
        </nav>

        {toast && (
          <div className="fixed bottom-[88px] left-1/2 z-50 flex w-[calc(100%-32px)] max-w-[398px] -translate-x-1/2 items-center gap-2 rounded-xl border border-[#4c3d34] bg-[#211b18] px-4 py-3 text-[11px] font-semibold text-[#f0e8de] shadow-2xl">
            <ShieldCheck size={16} className="shrink-0 text-[#9fd4ad]" />
            <span className="flex-1">{toast}</span>
            <button type="button" onClick={() => setToast("")} aria-label="Dismiss">
              <X size={14} className="text-[#8e9694]" />
            </button>
          </div>
        )}

        {rulesMatch && (
          <div
            className="fixed inset-0 z-40 flex items-end justify-center bg-[#07090a]/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
            onClick={() => setRulesMatch(null)}
          >
            <div
              className="w-full max-w-[430px] rounded-t-[26px] border border-[#3a4245] bg-[#181d20] p-5 shadow-2xl sm:rounded-[26px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">
                    Room rules
                  </p>
                  <h2 className="mt-2 text-[19px] font-bold tracking-[-0.04em] text-[#f5f0e8]">
                    {rulesMatch.title}
                  </h2>
                  <p className="mt-1 text-[10px] text-[#8b9698]">
                    {rulesMatch.game} · {rulesMatch.mode} · Entry ₹{rulesMatch.entry}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRulesMatch(null)}
                  className="rounded-lg p-2 text-[#8c9697] hover:bg-[#252c30] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-5 space-y-2.5">
                {[
                  "Room ID and password are shared 10 minutes before start.",
                  "No teaming, emulators, or modified clients. Fair play is monitored.",
                  "Top placements are paid to your Elite wallet within 30 minutes.",
                  "Entry fees are non-refundable once the room is locked.",
                ].map((rule, index) => (
                  <div
                    key={rule}
                    className="flex gap-3 rounded-xl border border-[#2b3336] bg-[#131719] p-3 text-[11px] leading-5 text-[#b5bcbb]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f]/15 text-[10px] font-bold text-[#ff7848]">
                      {index + 1}
                    </span>
                    {rule}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#1f2b24] p-3 text-[10px] text-[#a9c8b0]">
                <LockKeyhole size={15} />
                Your entry and payout are protected by match verification.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EliteEsportsHome;