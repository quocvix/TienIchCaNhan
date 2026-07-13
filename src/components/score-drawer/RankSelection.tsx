import type { Rank } from "./types";

interface RankSelectionProps {
    players: string[];
    ranks: Record<string, Rank | null>;
    isPlayerBurned: (name: string) => boolean;
    handlePlayerClick: (name: string) => void;
}

const rankStyles: Record<Rank, { bg: string; text: string; label: string }> = {
    NHẤT: { bg: "bg-[#d60000]", text: "text-white", label: "NHẤT" },
    NHÌ: { bg: "bg-[#e95a00]", text: "text-white", label: "NHÌ" },
    BA: { bg: "bg-[#d4a017]", text: "text-black", label: "BA" },
    BÉT: { bg: "bg-[#6b5b4b]", text: "text-white", label: "BÉT" },
};

export default function RankSelection({
    players,
    ranks,
    isPlayerBurned,
    handlePlayerClick,
}: RankSelectionProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Thứ tự về đích
            </h3>
            <div className="grid grid-cols-4 gap-3">
                {players.map((name) => {
                    const burned = isPlayerBurned(name);
                    const rank = ranks[name];
                    const style = rank ? rankStyles[rank] : null;

                    return (
                        <button
                            key={name}
                            onClick={() => handlePlayerClick(name)}
                            disabled={burned}
                            className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                                burned
                                    ? "bg-red-950/30 border border-red-500/20 text-red-400/60 cursor-not-allowed opacity-60"
                                    : style
                                      ? `${style.bg} ${style.text} active:scale-95`
                                      : "border border-white/10 text-gray-300 active:scale-95"
                            }`}
                        >
                            <span className="text-sm font-bold truncate max-w-[90%]">
                                {name}
                            </span>
                            {burned ? (
                                <span className="text-[9px] font-black uppercase tracking-wider text-red-400/80">
                                    CHÁY
                                </span>
                            ) : style ? (
                                <span className="text-[9px] font-black uppercase tracking-wider opacity-90">
                                    {style.label}
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
