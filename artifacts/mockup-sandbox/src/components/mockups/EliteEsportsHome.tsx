import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Edit3,
  Gamepad2,
  Headphones,
  Home,
  Info,
  LayoutGrid,
  LockKeyhole,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  FileText,
  SlidersHorizontal,
  Trophy,
  UserRound,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type MatchMode = "Solo" | "Duo" | "Squad";
type Filter = "All" | "Free Fire" | "BGMI" | MatchMode;
type Page = "Home" | "Matches" | "Wallet" | "Leaderboard";
type ProfilePage = "menu" | "account" | "game" | "settings" | "support" | "terms" | "privacy" | "about";
type DetailTab = "Players" | "Prize Pool" | "Rules";

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

const banners = [
  {
    id: 1,
    eyebrow: "WEEKLY SERIES",
    title: "Clutch Circuit",
    subtitle: "₹25 entry · ₹18,000 prize pool",
    cta: "View event",
    accent: "#ff5a1f",
    background: "linear-gradient(135deg, #3b1f19 0%, #1f1514 56%, #0e1112 100%)",
  },
  {
    id: 2,
    eyebrow: "BATTLE ROYALE",
    title: "Night Ops",
    subtitle: "Squad rooms · Erangel after dark",
    cta: "View event",
    accent: "#eab34d",
    background: "linear-gradient(135deg, #302718 0%, #1d1b17 55%, #0e1112 100%)",
  },
  {
    id: 3,
    eyebrow: "NEW THIS WEEK",
    title: "Neon Drop",
    subtitle: "Duo clash · 32 player rooms",
    cta: "View event",
    accent: "#77c69e",
    background: "linear-gradient(135deg, #18342f 0%, #172421 52%, #0e1112 100%)",
  },
];

const initialManagedFilters = [
  "Free Fire",
  "BGMI",
  "Solo",
  "Duo",
  "Squad",
  "Entry under ₹100",
];

function Money({ value }: { value: number }) {
  return <span>₹{value.toLocaleString("en-IN")}</span>;
}

function GameMark({ game }: { game: Match["game"] }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${
        game === "Free Fire"
          ? "bg-[#ff5a1f]/15 text-[#ff7b43]"
          : "bg-[#e8b24b]/15 text-[#e1ae42]"
      }`}
    >
      <Gamepad2 size={17} strokeWidth={1.8} />
    </div>
  );
}

function MatchArtwork({ match }: { match: Match }) {
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-[15px] border border-white/10"
      style={{
        background:
          match.game === "Free Fire"
            ? "linear-gradient(145deg, #572719, #241715 62%, #111416)"
            : "linear-gradient(145deg, #4d3b1f, #25221a 62%, #111416)",
      }}
    >
      <div
        className="absolute -right-5 -top-5 h-20 w-20 rounded-full blur-2xl"
        style={{ backgroundColor: `${match.accent}33` }}
      />
      <div
        className="absolute bottom-[-24px] left-[-18px] h-20 w-20 rounded-full border"
        style={{ borderColor: `${match.accent}55` }}
      />
      <div
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ borderColor: `${match.accent}88`, color: match.accent }}
      >
        <Zap size={20} strokeWidth={1.5} />
      </div>
      <span className="absolute left-2.5 top-2.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white/60">
        {match.game}
      </span>
    </div>
  );
}

function MatchCard({
  match,
  joined,
  onJoin,
  onOpen,
}: {
  match: Match;
  joined: boolean;
  onJoin: (match: Match) => void;
  onOpen: (match: Match) => void;
}) {
  const percent = Math.round((match.filled / match.total) * 100);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(match)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen(match);
      }}
      className="aspect-[16/9] w-full cursor-pointer rounded-[20px] border border-[#2b3236] bg-[#171c1f] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition active:scale-[0.99]"
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_112px] gap-3">
        <div className="flex min-w-0 flex-col">
          <div className="flex min-w-0 items-start gap-2.5">
            <GameMark game={match.game} />
            <div className="min-w-0">
              <p className="truncate text-[8px] font-bold uppercase tracking-[0.14em] text-[#808b8e]">
                {match.game}
              </p>
              <h3 className="mt-1 line-clamp-2 text-[13px] font-bold leading-4 tracking-[-0.02em] text-[#f5f0e9]">
                {match.title}
              </h3>
            </div>
          </div>
          <span className="mt-2.5 self-start rounded-md border border-[#3b4448] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#aab2b2]">
            {match.mode}
          </span>
          <div className="mt-3 flex items-center justify-between text-[9px] text-[#929d9f]">
            <span className="flex items-center gap-1">
              <Clock3 size={11} className="text-[#ff7140]" />
              Starts in {match.countdown}
            </span>
            <span className="font-semibold text-[#b7bfbd]">{percent}% filled</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#2a3033]">
            <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: match.accent }} />
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-1 border-t border-[#2a3034] pt-2.5">
            <div>
              <p className="text-[8px] uppercase tracking-[0.08em] text-[#747f83]">Prize</p>
              <p className="mt-0.5 text-[12px] font-bold text-[#efb24f]">
                <Money value={match.prize} />
              </p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-[0.08em] text-[#747f83]">Slots</p>
              <p className="mt-0.5 text-[12px] font-bold text-[#f3ede5]">
                {match.filled}
                <span className="font-medium text-[#758084]">/{match.total}</span>
              </p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-[0.08em] text-[#747f83]">Entry</p>
              <p className="mt-0.5 text-[12px] font-bold text-[#f3ede5]">
                <Money value={match.entry} />
              </p>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-lg border border-[#3a302b] bg-[#211b19] px-2.5 py-1.5">
            <CalendarDays size={13} className="shrink-0 text-[#ff7040]" />
            <div className="min-w-0">
              <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#907d73]">Match date & time</p>
              <p className="mt-0.5 truncate text-[10px] font-bold text-[#e9ded4]">{match.time}</p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <MatchArtwork match={match} />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onJoin(match);
            }}
            className={`mt-auto flex h-9 w-full items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition active:scale-[0.98] ${
              joined ? "bg-[#d8efdd] text-[#17442d]" : "bg-[#ff5a1f] text-[#1a120e]"
            }`}
          >
            {joined ? <ShieldCheck size={13} /> : <Zap size={13} />}
            {joined ? "Joined" : "Join"}
          </button>
        </div>
      </div>
      <div
        className="sr-only"
        style={{ backgroundColor: match.accent }}
      >
        {percent}% filled
      </div>
    </article>
  );
}

function PageTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff7040]">
        {eyebrow}
      </p>
      <h1 className="mt-1.5 text-[23px] font-bold tracking-[-0.05em] text-[#f4efe8]">
        {title}
      </h1>
      <p className="mt-1 text-[11px] leading-5 text-[#7f8b8e]">{subtitle}</p>
    </div>
  );
}

function WalletPage() {
  return (
    <div className="space-y-4">
      <PageTitle eyebrow="YOUR FUNDS" title="Wallet" subtitle="Manage entries, winnings, and withdrawals." />
      <section className="rounded-[21px] border border-[#4b3025] bg-[#211916] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#b89580]">Available balance</p>
        <p className="mt-2 text-[32px] font-extrabold tracking-[-0.06em] text-[#f8f1e9]">₹1,240</p>
        <div className="mt-5 flex gap-2">
          <button type="button" className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff5a1f] text-[11px] font-bold text-[#1a120e]"><Plus size={15} /> Add money</button>
          <button type="button" className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#55413a] text-[11px] font-bold text-[#d6cdc3]">Withdraw</button>
        </div>
      </section>
      <section className="rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#f2ece4]">Recent activity</h2>
          <span className="text-[10px] text-[#ff7040]">View all</span>
        </div>
        {[
          ["Prize winning", "+ ₹640", "Approved"],
          ["Match entry · Night Ops", "- ₹99", "Completed"],
          ["UPI deposit", "+ ₹500", "Approved"],
        ].map(([label, amount, status]) => (
          <div key={label} className="mt-4 flex items-center justify-between border-t border-[#293034] pt-3">
            <div><p className="text-[11px] font-semibold text-[#d8d2ca]">{label}</p><p className="mt-1 text-[9px] text-[#788487]">{status} · Today</p></div>
            <p className={`text-[12px] font-bold ${amount.startsWith("+") ? "text-[#90c69f]" : "text-[#e3a39a]"}`}>{amount}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function LeaderboardPage() {
  const players = [
    ["01", "ArjunKiller", "₹12,480", "2,840 pts"],
    ["02", "MambaOP", "₹10,920", "2,610 pts"],
    ["03", "Rohan Shah", "₹4,860", "1,840 pts"],
    ["04", "ClutchGod", "₹4,240", "1,720 pts"],
  ];
  return (
    <div>
      <PageTitle eyebrow="THE ARENA" title="Leaderboard" subtitle="Weekly rankings based on winnings and kill points." />
      <div className="mt-5 flex gap-2 rounded-xl bg-[#171d20] p-1">
        <button type="button" className="h-9 flex-1 rounded-lg bg-[#ff5a1f] text-[11px] font-bold text-[#1b130f]">This week</button>
        <button type="button" className="h-9 flex-1 rounded-lg text-[11px] font-bold text-[#7f8b8e]">This month</button>
      </div>
      <section className="mt-4 overflow-hidden rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
        {players.map(([rank, name, winnings, points]) => (
          <div key={name} className="flex items-center gap-3 border-b border-[#293034] py-3 last:border-0">
            <span className={`w-5 text-center text-[11px] font-bold ${rank === "03" ? "text-[#ff7040]" : "text-[#7e898d]"}`}>{rank}</span>
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-extrabold ${rank === "03" ? "bg-[#d8a04f] text-[#281c12]" : "bg-[#2d363a] text-[#cad0ce]"}`}>{name.slice(0, 2).toUpperCase()}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-bold text-[#e8e1d8]">{name}</p><p className="mt-0.5 text-[9px] text-[#778387]">{points}</p></div>
            <p className="text-[11px] font-bold text-[#efb24f]">{winnings}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function ProfileScreen({
  page,
  onBack,
  onNavigate,
  onToast,
}: {
  page: ProfilePage;
  onBack: () => void;
  onNavigate: (page: ProfilePage) => void;
  onToast: (message: string) => void;
}) {
  const pageCopy: Record<Exclude<ProfilePage, "menu">, { eyebrow: string; title: string; subtitle: string }> = {
    account: {
      eyebrow: "ACCOUNT",
      title: "Account settings",
      subtitle: "Keep your personal details and security up to date.",
    },
    game: {
      eyebrow: "PLAYER IDENTITY",
      title: "In-game details",
      subtitle: "Your verified identity is used when you join custom rooms.",
    },
    settings: {
      eyebrow: "PREFERENCES",
      title: "Settings",
      subtitle: "Control your app experience and account security.",
    },
    support: {
      eyebrow: "WE ARE HERE",
      title: "Contact support",
      subtitle: "Get help with entries, payouts, rooms, or account access.",
    },
    terms: {
      eyebrow: "LEGAL",
      title: "Terms & conditions",
      subtitle: "The rules that keep every Elite match fair.",
    },
    privacy: {
      eyebrow: "LEGAL",
      title: "Privacy policy",
      subtitle: "How Elite eSports handles your account information.",
    },
    about: {
      eyebrow: "ELITE ESPORTS",
      title: "About the platform",
      subtitle: "A skill-first arena built for competitive mobile players.",
    },
  };

  const Row = ({
    icon: Icon,
    label,
    detail,
    target,
  }: {
    icon: typeof UserRound;
    label: string;
    detail: string;
    target: ProfilePage;
  }) => (
    <button
      type="button"
      onClick={() => onNavigate(target)}
      className="flex w-full items-center gap-3 border-b border-[#293034] py-3.5 text-left last:border-0"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#242c2f] text-[#ff7040]">
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-[12px] font-bold text-[#e8e1d8]">{label}</strong>
        <span className="mt-1 block truncate text-[9px] text-[#7f8b8e]">{detail}</span>
      </span>
      <ChevronRight size={16} className="text-[#748084]" />
    </button>
  );

  if (page === "menu") {
    return (
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-1 text-[11px] font-bold text-[#aab3b2]"
        >
          <ChevronLeft size={16} /> Back to home
        </button>
        <section className="rounded-[22px] border border-[#4b3025] bg-[#211916] p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d8a04f] text-[20px] font-extrabold text-[#281c12]">
              R
            </span>
            <div>
              <h1 className="text-[21px] font-extrabold tracking-[-0.05em] text-[#fbf6ef]">Rohan Shah</h1>
              <p className="mt-1 text-[10px] text-[#b39f91]">@rohan.shah · Level 18</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("account")}
            className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#624333] text-[11px] font-bold text-[#e0c8b7]"
          >
            <Edit3 size={14} /> Edit profile
          </button>
        </section>

        <section className="mt-4 rounded-[21px] border border-[#2b3236] bg-[#171c1f] px-4">
          <p className="pt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">Account</p>
          <Row icon={UserRound} label="Account settings" detail="Name, email, date of birth, security" target="account" />
          <Row icon={Gamepad2} label="In-game details" detail="IGN, player UID, preferred game" target="game" />
        </section>

        <section className="mt-3 rounded-[21px] border border-[#2b3236] bg-[#171c1f] px-4">
          <p className="pt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">App & help</p>
          <Row icon={Settings} label="Settings" detail="Theme, notifications, password, 2FA" target="settings" />
          <Row icon={Headphones} label="Contact support" detail="WhatsApp, Telegram, report an issue" target="support" />
          <Row icon={Info} label="About platform" detail="Fair play, skill-based gaming, version 1.0.0" target="about" />
        </section>

        <section className="mt-3 rounded-[21px] border border-[#2b3236] bg-[#171c1f] px-4">
          <p className="pt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">Legal</p>
          <Row icon={FileText} label="Terms & conditions" detail="Match rules, age gate, jurisdiction clauses" target="terms" />
          <Row icon={ShieldCheck} label="Privacy policy" detail="Your data, storage, and account controls" target="privacy" />
        </section>

        <button
          type="button"
          onClick={() => onToast("Log out is ready for the connected account.")}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-[#4a3431] text-[11px] font-bold text-[#dd9d91]"
        >
          Log out
        </button>
      </div>
    );
  }

  const copy = pageCopy[page];

  return (
    <div>
      <button
        type="button"
        onClick={() => onNavigate("menu")}
        className="mb-5 flex items-center gap-1 text-[11px] font-bold text-[#aab3b2]"
      >
        <ChevronLeft size={16} /> Profile
      </button>
      <PageTitle eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />

      {page === "account" && (
        <div className="mt-5 space-y-3">
          <section className="rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
            {[
              ["Full name", "Rohan Shah"],
              ["Email address", "rohan.shah@email.com"],
              ["Date of birth", "12 March 2001 · 25+ verified"],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-[#293034] py-3 first:pt-0 last:border-0 last:pb-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#788487]">{label}</p>
                <p className="mt-1 text-[12px] font-semibold text-[#e0d9d1]">{value}</p>
              </div>
            ))}
          </section>
          <section className="rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-[12px] font-bold text-[#e8e1d8]">Two-factor authentication</p><p className="mt-1 text-[9px] text-[#7f8b8e]">Extra protection for wallet actions</p></div>
              <span className="rounded-full bg-[#1f2b24] px-2.5 py-1 text-[9px] font-bold text-[#9fc5a9]">Enabled</span>
            </div>
          </section>
          <button type="button" onClick={() => onToast("Account changes are ready to save.")} className="h-11 w-full rounded-xl bg-[#ff5a1f] text-[11px] font-bold text-[#1b130f]">Save changes</button>
        </div>
      )}

      {page === "game" && (
        <div className="mt-5 space-y-3">
          <section className="rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
            {[
              ["In-game name (IGN)", "RohanOP"],
              ["Player UID", "1849205612"],
              ["Preferred game", "Free Fire"],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-[#293034] py-3 first:pt-0 last:border-0 last:pb-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#788487]">{label}</p>
                <p className="mt-1 text-[12px] font-semibold text-[#e0d9d1]">{value}</p>
              </div>
            ))}
          </section>
          <div className="flex items-center gap-2 rounded-xl bg-[#1f2b24] p-3 text-[10px] leading-4 text-[#a9c8b0]"><ShieldCheck size={15} className="shrink-0" />Your IGN and UID are shown to room admins so you are not removed from custom rooms.</div>
          <button type="button" onClick={() => onToast("In-game details are ready to save.")} className="h-11 w-full rounded-xl bg-[#ff5a1f] text-[11px] font-bold text-[#1b130f]">Save in-game details</button>
        </div>
      )}

      {page === "settings" && (
        <div className="mt-5 space-y-3">
          <section className="rounded-[21px] border border-[#2b3236] bg-[#171c1f] px-4">
            {[
              ["App theme", "Dark mode"],
              ["Match reminders", "Notifications enabled"],
              ["Two-factor authentication", "Enabled"],
            ].map(([label, detail]) => (
              <button key={label} type="button" onClick={() => onToast(`${label} controls are ready.`)} className="flex w-full items-center justify-between border-b border-[#293034] py-4 text-left last:border-0">
                <span><strong className="block text-[12px] text-[#e4ded6]">{label}</strong><span className="mt-1 block text-[9px] text-[#7f8b8e]">{detail}</span></span>
                <ChevronRight size={16} className="text-[#748084]" />
              </button>
            ))}
          </section>
          <button type="button" onClick={() => onToast("Password reset link sent to your email.")} className="flex h-11 w-full items-center justify-center rounded-xl border border-[#3b4549] text-[11px] font-bold text-[#b9c2bf]">Reset password</button>
        </div>
      )}

      {page === "support" && (
        <div className="mt-5 space-y-3">
          {[
            [Headphones, "Chat with support", "Get help with a match or payment", "Open WhatsApp"],
            [Gamepad2, "Community help", "Join the verified Elite Telegram", "Open Telegram"],
            [ShieldCheck, "Report an issue", "Send a complaint directly to admins", "Create report"],
          ].map(([Icon, label, detail, action]) => (
            <button key={String(label)} type="button" onClick={() => onToast(`${String(action)} is ready.`)} className="flex w-full items-center gap-3 rounded-[19px] border border-[#2b3236] bg-[#171c1f] p-4 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff5a1f]/12 text-[#ff7040]"><Icon size={17} /></span>
              <span className="min-w-0 flex-1"><strong className="block text-[12px] text-[#e5ded6]">{String(label)}</strong><span className="mt-1 block text-[9px] text-[#7f8b8e]">{String(detail)}</span></span>
              <ChevronRight size={16} className="text-[#748084]" />
            </button>
          ))}
          <div className="rounded-xl bg-[#1f2b24] p-3 text-[10px] leading-4 text-[#a9c8b0]">Support is available daily from 9:00 AM to 11:00 PM IST.</div>
        </div>
      )}

      {(page === "terms" || page === "privacy" || page === "about") && (
        <section className="mt-5 rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
          {page === "terms" && <><h2 className="text-[14px] font-bold text-[#f2ece4]">Play fair. Get paid clearly.</h2><p className="mt-3 text-[11px] leading-5 text-[#a0aaaa]">Elite eSports is a skill-based gaming platform for players aged 18 and above. By joining a match, you agree to follow the published rules, use an approved device, and provide accurate in-game details.</p><p className="mt-3 text-[11px] leading-5 text-[#a0aa2] text-[#a0aaaa]">Matches and payouts may be restricted in prohibited jurisdictions. Elite eSports is not responsible for publisher bans, device issues, or peer-to-peer disputes outside the platform.</p><div className="mt-4 rounded-xl bg-[#1f2b24] p-3 text-[10px] leading-4 text-[#a9c8b0]"><ShieldCheck size={14} className="mb-1" />Fair-play violations can result in removal, wallet review, or account suspension.</div></>}
          {page === "privacy" && <><h2 className="text-[14px] font-bold text-[#f2ece4]">Your data stays in your control.</h2><p className="mt-3 text-[11px] leading-5 text-[#a0aaaa]">We use your account details, date of birth, payment references, and in-game identity to verify eligibility, protect matches, process payouts, and provide support.</p><p className="mt-3 text-[11px] leading-5 text-[#a0aaaa]">Payment proofs are kept private and are visible only to authorized review staff. You can request account support or data access from the support team.</p></>}
          {page === "about" && <><h2 className="text-[14px] font-bold text-[#f2ece4]">Built for the next clutch.</h2><p className="mt-3 text-[11px] leading-5 text-[#a0aaaa]">Elite eSports brings verified skill-based tournaments, transparent prize pools, and protected wallet payouts to mobile gamers.</p><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#131719] p-3"><p className="text-[9px] uppercase tracking-[0.1em] text-[#788487]">Version</p><p className="mt-1 text-[12px] font-bold text-[#e4ded6]">1.0.0</p></div><div className="rounded-xl bg-[#131719] p-3"><p className="text-[9px] uppercase tracking-[0.1em] text-[#788487]">Players</p><p className="mt-1 text-[12px] font-bold text-[#e4ded6]">18+ only</p></div></div></>}
        </section>
      )}
    </div>
  );
}

function MatchDetails({
  match,
  joined,
  onBack,
  onJoin,
}: {
  match: Match;
  joined: boolean;
  onBack: () => void;
  onJoin: (match: Match) => void;
}) {
  const [tab, setTab] = useState<DetailTab>("Players");
  const tabs: DetailTab[] = ["Players", "Prize Pool", "Rules"];
  const players = [
    ["Rohan Shah", "RohanOP", "You", "RS"],
    ["ArjunKiller", "ARJUN999", "Verified", "AK"],
    ["MambaOP", "MAMBA07", "Verified", "MO"],
    ["ClutchGod", "CLUTCHX", "Verified", "CG"],
    ["ShadowV", "SHADOWV", "Verified", "SV"],
  ];

  return (
    <div>
      <div className="mb-5 flex items-center">
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-[11px] font-bold text-[#aab3b2]">
          <ChevronLeft size={16} /> Back to matches
        </button>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-[104px] shrink-0"><MatchArtwork match={match} /></div>
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff7040]">{match.game} · {match.mode}</p>
          <h1 className="mt-1.5 text-[21px] font-extrabold leading-6 tracking-[-0.05em] text-[#f5f0e9]">{match.title}</h1>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#4b3329] bg-[#241916] px-3.5 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff5a1f]/12 text-[#ff7040]"><CalendarDays size={17} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#a28474]">Match date & time</p>
          <p className="mt-1 truncate text-[12px] font-extrabold text-[#f3e9df]">{match.time}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#34241f] px-2 py-1 text-[8px] font-bold text-[#ff9b70]">{match.countdown}</span>
      </div>
      <button type="button" onClick={() => onJoin(match)} className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-bold ${joined ? "bg-[#d8efdd] text-[#17442d]" : "bg-[#ff5a1f] text-[#1a120e]"}`}>
        {joined ? <ShieldCheck size={15} /> : <Zap size={15} />}
        {joined ? "Spot reserved" : `Join for ₹${match.entry}`}
      </button>

      <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-[#171d20] p-1">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`w-full rounded-lg px-1 py-2.5 text-center text-[10px] font-bold transition ${tab === item ? "bg-[#ff5a1f] text-[#1b130f]" : "text-[#849094]"}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === "Players" && (
        <section className="mt-3 rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
          <div className="flex items-center justify-between">
            <div><h2 className="text-[14px] font-bold text-[#f2ece4]">Joined players</h2><p className="mt-1 text-[9px] text-[#7f8b8e]">Verified identities in this room</p></div>
            <span className="rounded-full bg-[#1f2b24] px-2.5 py-1 text-[9px] font-bold text-[#9fc5a9]">{match.filled}/{match.total}</span>
          </div>
          <div className="mt-3 space-y-1">
            {players.map(([name, ign, status, initials], index) => (
              <div key={name} className="flex items-center gap-2.5 border-b border-[#293034] py-2.5 last:border-0">
                <span className="w-4 text-center text-[9px] font-bold text-[#7f8b8e]">{index + 1}</span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[8px] font-extrabold ${status === "You" ? "bg-[#d8a04f] text-[#281c12]" : "bg-[#303b3f] text-[#dce3df]"}`}>{initials}</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-[11px] text-[#e5ded6]">{name}</strong><span className="mt-0.5 block truncate text-[9px] text-[#778487]">{ign}</span></span>
                <span className={`text-[9px] font-bold ${status === "You" ? "text-[#ff7040]" : "text-[#8fbd9b]"}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-[10px] font-semibold text-[#7f8b8e]">Showing verified players in this room</div>
        </section>
      )}

      {tab === "Prize Pool" && (
        <section className="mt-3 rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
          <div className="flex items-center justify-between"><div><h2 className="text-[14px] font-bold text-[#f2ece4]">Prize pool</h2><p className="mt-1 text-[9px] text-[#7f8b8e]">Total pool · <Money value={match.prize} /></p></div><Trophy size={19} className="text-[#efb24f]" /></div>
          <div className="mt-4 space-y-2">
            {[
              ["1st place", "₹900", "50%"],
              ["2nd place", "₹540", "30%"],
              ["3rd place", "₹360", "20%"],
              ["Kill rewards", "Included", "₹40 / kill"],
            ].map(([label, amount, share]) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-[#131719] px-3 py-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff5a1f]/12 text-[10px] font-bold text-[#ff7040]">{label === "Kill rewards" ? "K" : label.charAt(0)}</span><span className="flex-1"><strong className="block text-[11px] text-[#d9d2ca]">{label}</strong><span className="mt-0.5 block text-[9px] text-[#778487]">{share}</span></span><strong className="text-[12px] text-[#efb24f]">{amount}</strong></div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#1f2b24] p-3 text-[10px] leading-4 text-[#a9c8b0]"><ShieldCheck size={14} />Winnings are credited to your wallet after result verification.</div>
        </section>
      )}

      {tab === "Rules" && (
        <section className="mt-3 rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4">
          <div className="flex items-center gap-2"><CircleHelp size={15} className="text-[#ff7040]" /><h2 className="text-[14px] font-bold text-[#f2ece4]">Room rules</h2></div>
          <div className="mt-4 space-y-2">
            {["Room ID and password are shared 10 minutes before start.", "No teaming, emulators, or modified clients. Fair play is monitored.", "Top placements are paid to your Elite wallet within 30 minutes.", "Entry fees are non-refundable once the room is locked."].map((rule, index) => <div key={rule} className="flex gap-3 rounded-xl bg-[#131719] p-3 text-[10px] leading-4 text-[#aeb8b6]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f]/12 text-[9px] font-bold text-[#ff7040]">{index + 1}</span>{rule}</div>)}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#1f2b24] p-3 text-[10px] text-[#a9c8b0]"><LockKeyhole size={14} />Fair play is monitored in every room.</div>
        </section>
      )}

    </div>
  );
}

export function EliteEsportsHome() {
  const [filter, setFilter] = useState<Filter>("All");
  const [joined, setJoined] = useState<number[]>([]);
  const [activeNav, setActiveNav] = useState<Page>("Home");
  const [activeBanner, setActiveBanner] = useState(0);
  const [rulesMatch, setRulesMatch] = useState<Match | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [toast, setToast] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterManager, setShowFilterManager] = useState(false);
  const [managedFilters, setManagedFilters] = useState(initialManagedFilters);
  const [advancedGame, setAdvancedGame] = useState("Any game");
  const [advancedEntry, setAdvancedEntry] = useState("Any entry fee");
  const [profilePage, setProfilePage] = useState<ProfilePage | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleMatches = useMemo(
    () =>
      filter === "All"
        ? matches
        : matches.filter((match) => match.game === filter || match.mode === filter),
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

  const activeBannerData = banners[activeBanner];

  return (
    <div className="min-h-screen bg-[#0b0e10] text-[#f4efe8]" style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#101416] shadow-2xl">
        <header className="flex h-[72px] items-center justify-between border-b border-[#252c30] px-5">
          <button type="button" onClick={() => { setProfilePage("menu"); setSelectedMatch(null); }} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8a04f] text-[13px] font-extrabold text-[#281c12]">R</span>
            <span className="text-[14px] font-bold tracking-[-0.03em] text-[#f4efe8]">Rohan</span>
          </button>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setActiveNav("Wallet")} className="flex h-10 items-center gap-1.5 rounded-xl border border-[#353e42] bg-[#171c1f] px-3 text-[12px] font-bold text-[#f3eee7]">
              <WalletCards size={15} className="text-[#ff7040]" />₹1,240<Plus size={13} className="text-[#879295]" />
            </button>
            <button type="button" onClick={() => setToast("No new notifications.")} aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#9ca6a7] hover:bg-[#1c2326]">
              <Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
            </button>
          </div>
        </header>

        <main className="px-4 pb-28 pt-5">
          {selectedMatch ? (
            <MatchDetails
              match={selectedMatch}
              joined={joined.includes(selectedMatch.id)}
              onBack={() => setSelectedMatch(null)}
              onJoin={handleJoin}
            />
          ) : activeNav === "Wallet" ? (
            <WalletPage />
          ) : activeNav === "Leaderboard" ? (
            <LeaderboardPage />
          ) : activeNav === "Matches" ? (
            <div><PageTitle eyebrow="YOUR ARENA" title="My matches" subtitle="Track every room you have joined." /><section className="mt-5 rounded-[21px] border border-[#2b3236] bg-[#171c1f] p-4"><div className="flex gap-2 rounded-xl bg-[#121719] p-1"><button type="button" className="h-9 flex-1 rounded-lg bg-[#ff5a1f] text-[10px] font-bold text-[#1b130f]">Upcoming ({joined.length})</button><button type="button" className="h-9 flex-1 rounded-lg text-[10px] font-bold text-[#7f8b8e]">Completed</button></div>{joined.length === 0 ? <div className="py-14 text-center"><Trophy size={25} className="mx-auto text-[#7b878a]" /><p className="mt-3 text-[12px] font-semibold text-[#c9d0cd]">No upcoming matches</p><p className="mt-1 text-[10px] text-[#7b878a]">Join a room from Home to see it here.</p></div> : <div className="mt-4 space-y-2">{matches.filter((match) => joined.includes(match.id)).map((match) => <button type="button" onClick={() => setSelectedMatch(match)} key={match.id} className="flex w-full items-center gap-3 rounded-xl bg-[#131719] p-3 text-left"><GameMark game={match.game} /><span className="min-w-0 flex-1"><strong className="block truncate text-[11px] text-[#e8e1d8]">{match.title}</strong><span className="mt-1 block text-[9px] text-[#7d898d]">{match.time}</span></span><ChevronRight size={15} className="text-[#7f8b8e]" /></button>)}</div>}</section></div>
          ) : (
            <div>
              <section className="relative overflow-hidden rounded-[21px] border border-[#303b3e]" style={{ background: activeBannerData.background }}>
                <div className="relative aspect-[16/9] p-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em]" style={{ color: activeBannerData.accent }}>{activeBannerData.eyebrow}</p>
                  <h1 className="mt-2 max-w-[190px] text-[25px] font-extrabold leading-7 tracking-[-0.06em] text-[#fbf6ef]">{activeBannerData.title}</h1>
                  <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-[#b8aba1]">{activeBannerData.subtitle}</p>
                  <button type="button" onClick={() => setToast(`Opening ${activeBannerData.title} event.`)} className="absolute bottom-5 right-5 flex h-9 items-center gap-1.5 rounded-xl px-3 text-[10px] font-bold text-[#1a120e]" style={{ backgroundColor: activeBannerData.accent }}>{activeBannerData.cta}<ChevronRight size={13} /></button>
                  <div className="absolute bottom-5 right-[112px] flex h-[92px] w-[92px] items-center justify-center rounded-full border opacity-70" style={{ borderColor: `${activeBannerData.accent}44` }}><div className="flex h-[62px] w-[62px] items-center justify-center rounded-full border" style={{ borderColor: `${activeBannerData.accent}66`, color: activeBannerData.accent }}><Zap size={34} strokeWidth={1.2} /></div></div>
                  <div className="absolute right-5 top-4 flex gap-1.5">{banners.map((banner, index) => <button key={banner.id} type="button" aria-label={`Show banner ${index + 1}`} onClick={() => setActiveBanner(index)} className={`h-1.5 rounded-full transition-all ${activeBanner === index ? "w-5" : "w-1.5 bg-white/30"}`} style={activeBanner === index ? { backgroundColor: banner.accent } : undefined} />)}</div>
                </div>
                <button type="button" aria-label="Previous banner" onClick={() => setActiveBanner((activeBanner + banners.length - 1) % banners.length)} className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/70"><ChevronLeft size={15} /></button>
                <button type="button" aria-label="Next banner" onClick={() => setActiveBanner((activeBanner + 1) % banners.length)} className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/70"><ChevronRight size={15} /></button>
              </section>

              <section className="mt-6">
                <div className="flex items-end justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff7040]">DISCOVER</p><h2 className="mt-1.5 text-[21px] font-bold tracking-[-0.05em] text-[#f4efe8]">Open matches</h2></div><button type="button" onClick={() => setShowFilters(true)} className="flex items-center gap-1.5 rounded-xl border border-[#343e42] px-3 py-2 text-[10px] font-bold text-[#aeb7b6]"><SlidersHorizontal size={13} /> Filters</button></div>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{(["All", "Free Fire", "BGMI", "Solo", "Duo", "Squad"] as Filter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-bold transition ${filter === item ? "border-[#ff5a1f] bg-[#ff5a1f] text-[#1b130f]" : "border-[#333d41] bg-[#171d20] text-[#929d9f]"}`}>{item}</button>)}</div>
                <div className="mt-3 space-y-3.5">{visibleMatches.map((match) => <MatchCard key={match.id} match={match} joined={joined.includes(match.id)} onJoin={handleJoin} onOpen={setSelectedMatch} />)}</div>
              </section>
            </div>
          )}
        </main>

        {profilePage && (
          <div
            className="fixed inset-0 z-50 flex justify-start bg-[#07090a]/72 backdrop-blur-[2px]"
            onClick={() => setProfilePage(null)}
          >
            <aside
              role="dialog"
              aria-label="Profile menu"
              className="h-full w-[min(92vw,390px)] overflow-hidden border-r border-[#343e42] bg-[#121719] shadow-[18px_0_45px_rgba(0,0,0,0.35)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex h-[72px] items-center justify-between border-b border-[#293034] px-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff7040]">PLAYER MENU</p>
                  <p className="mt-1 text-[13px] font-bold text-[#eee8df]">Rohan Shah</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfilePage(null)}
                  aria-label="Close profile menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#343e42] text-[#8d989a] hover:bg-[#20282b] hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="h-[calc(100%-72px)] overflow-y-auto px-4 pb-8 pt-5">
                <ProfileScreen
                  page={profilePage}
                  onBack={() => setProfilePage(null)}
                  onNavigate={setProfilePage}
                  onToast={setToast}
                />
              </div>
            </aside>
          </div>
        )}

        <nav className="fixed bottom-0 left-1/2 z-20 flex h-[76px] w-full max-w-[430px] -translate-x-1/2 items-start border-t border-[#292f33] bg-[#121719]/95 px-3 pt-3 backdrop-blur-xl">
          {[{ label: "Home" as Page, icon: Home }, { label: "Matches" as Page, icon: Trophy }, { label: "Wallet" as Page, icon: WalletCards }, { label: "Leaderboard" as Page, icon: LayoutGrid }].map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => { setSelectedMatch(null); setActiveNav(label); }} className={`flex flex-1 flex-col items-center gap-1 text-[9px] font-bold transition ${activeNav === label && !selectedMatch ? "text-[#ff7040]" : "text-[#7d888b]"}`}><span className={`flex h-8 w-10 items-center justify-center rounded-xl ${activeNav === label && !selectedMatch ? "bg-[#ff5a1f]/12" : ""}`}><Icon size={18} strokeWidth={activeNav === label && !selectedMatch ? 2.4 : 1.8} /></span>{label}</button>)}
        </nav>

        {toast && <div className="fixed bottom-[88px] left-1/2 z-50 flex w-[calc(100%-32px)] max-w-[398px] -translate-x-1/2 items-center gap-2 rounded-xl border border-[#4c3d34] bg-[#211b18] px-4 py-3 text-[11px] font-semibold text-[#f0e8de] shadow-2xl"><ShieldCheck size={16} className="shrink-0 text-[#9fd4ad]" /><span className="flex-1">{toast}</span><button type="button" onClick={() => setToast("")} aria-label="Dismiss"><X size={14} className="text-[#8e9694]" /></button></div>}

        {showFilters && <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#07090a]/75 p-0 backdrop-blur-sm" onClick={() => setShowFilters(false)}><div className="w-full max-w-[430px] rounded-t-[26px] border border-[#3a4245] bg-[#181d20] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">ADVANCED FILTERS</p><h2 className="mt-1.5 text-[20px] font-bold tracking-[-0.04em] text-[#f5f0e8]">Find your room</h2></div><button type="button" onClick={() => setShowFilters(false)} className="rounded-lg p-2 text-[#8c9697]"><X size={18} /></button></div><div className="mt-5 space-y-3"><label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7e898d]">Game<span className="mt-1.5 flex h-11 items-center rounded-xl border border-[#343e42] bg-[#121719] px-3 text-[12px] normal-case tracking-normal text-[#d7d0c7]">{advancedGame}<ChevronRight size={15} className="ml-auto text-[#7f8b8e]" /></span></label><label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7e898d]">Entry fee<span className="mt-1.5 flex h-11 items-center rounded-xl border border-[#343e42] bg-[#121719] px-3 text-[12px] normal-case tracking-normal text-[#d7d0c7]">{advancedEntry}<ChevronRight size={15} className="ml-auto text-[#7f8b8e]" /></span></label><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7e898d]">Match date</p><div className="mt-1.5 flex gap-2"><button type="button" className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff5a1f] text-[10px] font-bold text-[#1b130f]"><CalendarDays size={14} /> Today</button><button type="button" className="h-10 flex-1 rounded-xl border border-[#343e42] text-[10px] font-bold text-[#8e999b]">Tomorrow</button></div></div></div><div className="mt-5 flex items-center justify-between border-t border-[#2b3336] pt-4"><button type="button" onClick={() => { setAdvancedGame("Any game"); setAdvancedEntry("Any entry fee"); setFilter("All"); }} className="text-[11px] font-bold text-[#8f9a9c]">Reset</button><div className="flex items-center gap-2"><button type="button" onClick={() => setShowFilterManager(true)} className="flex h-10 items-center gap-1.5 rounded-xl border border-[#3b4549] px-3 text-[10px] font-bold text-[#aeb7b6]"><Edit3 size={13} /> Manage filters</button><button type="button" onClick={() => { setShowFilters(false); setToast("Filters applied to the match list."); }} className="h-10 rounded-xl bg-[#ff5a1f] px-4 text-[10px] font-bold text-[#1b130f]">Apply filters</button></div></div></div></div>}

        {showFilterManager && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#07090a]/80 p-0 backdrop-blur-sm" onClick={() => setShowFilterManager(false)}><div className="w-full max-w-[430px] rounded-t-[26px] border border-[#3a4245] bg-[#181d20] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">ADMIN PANEL</p><h2 className="mt-1.5 text-[20px] font-bold tracking-[-0.04em] text-[#f5f0e8]">Manage filters</h2><p className="mt-1 text-[10px] text-[#7f8b8e]">Add, edit, or remove player-facing options.</p></div><button type="button" onClick={() => setShowFilterManager(false)} className="rounded-lg p-2 text-[#8c9697]"><X size={18} /></button></div><div className="mt-4 space-y-2">{managedFilters.map((item, index) => <div key={item} className="flex items-center gap-2 rounded-xl border border-[#2b3336] bg-[#131719] px-3 py-2.5"><span className="flex-1 text-[11px] font-semibold text-[#d8d2ca]">{item}</span><button type="button" onClick={() => setToast(`Editing ${item} filter.`)} aria-label={`Edit ${item}`} className="rounded-lg p-2 text-[#899497] hover:bg-[#242c30] hover:text-white"><Edit3 size={14} /></button><button type="button" onClick={() => setManagedFilters((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${item}`} className="rounded-lg p-2 text-[#899497] hover:bg-[#2c2422] hover:text-[#ff8060]"><X size={15} /></button></div>)}</div><button type="button" onClick={() => setManagedFilters((current) => [...current, "New custom filter"])} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#536064] text-[11px] font-bold text-[#b6c0be]"><Plus size={15} /> Add filter option</button></div></div>}

        {rulesMatch && <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#07090a]/75 p-0 backdrop-blur-sm" onClick={() => setRulesMatch(null)}><div className="w-full max-w-[430px] rounded-t-[26px] border border-[#3a4245] bg-[#181d20] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff7040]">ROOM RULES</p><h2 className="mt-2 text-[19px] font-bold text-[#f5f0e8]">{rulesMatch.title}</h2></div><button type="button" onClick={() => setRulesMatch(null)} className="rounded-lg p-2 text-[#8c9697]"><X size={18} /></button></div><div className="mt-4 rounded-xl bg-[#1f2b24] p-3 text-[10px] leading-5 text-[#a9c8b0]"><LockKeyhole size={14} className="mb-1" />Room details, rules, members, and prize distribution are available after opening the match.</div></div></div>}
      </div>
    </div>
  );
}

export default EliteEsportsHome;