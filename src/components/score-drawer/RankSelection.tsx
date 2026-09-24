import type { Player, Rank } from "./types";

interface RankSelectionProps {
    players: Player[];
    ranks: Record<string, Rank | null>;
    isPlayerBurned: (id: string) => boolean;
    handlePlayerClick: (id: string) => void;
}

const rankConfigs: Record<
    Rank,
    { bg: string; text: string; label: string; icon: string; border: string }
> = {
    NHẤT: {
        bg: "bg-gradient-to-br from-amber-400 to-amber-600",
        text: "text-black",
        label: "VỀ NHẤT",
        icon: "🥇",
        border: "border-amber-300/40 shadow-lg shadow-amber-500/20",
    },
    NHÌ: {
        bg: "bg-gradient-to-br from-slate-200 to-slate-400",
        text: "text-black",
        label: "VỀ NHÌ",
        icon: "🥈",
        border: "border-slate-200/40 shadow-md shadow-slate-400/10",
    },
    BA: {
        bg: "bg-gradient-to-br from-amber-700 to-orange-800",
        text: "text-white",
        label: "VỀ BA",
        icon: "🥉",
        border: "border-orange-500/30 shadow-md shadow-orange-700/10",
    },
    BÉT: {
        bg: "bg-gradient-to-br from-rose-950 to-red-950",
        text: "text-rose-200",
        label: "VỀ BÉT",
        icon: "💀",
        border: "border-rose-500/40",
    },
};

export default function RankSelection({
    players,
    ranks,
    isPlayerBurned,
    handlePlayerClick,
}: RankSelectionProps) {
    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    Thứ tự về đích
                </h3>
                <span className="text-[10px] text-gray-500">
                    Chạm để xoay vòng (Nhất → Nhì → Ba → Bét)
                </span>
            </div>

            <div className={`grid gap-2.5 ${players.length <= 2 ? "grid-cols-2" : "grid-cols-2"}`}>
                {players.map((player) => {
                    const burned = isPlayerBurned(player.id);
                    const rank = ranks[player.id];
                    const config = rank ? rankConfigs[rank] : null;

                    return (
                        <button
                            key={player.id}
                            type="button"
                            onClick={() => handlePlayerClick(player.id)}
                            disabled={burned}
                            className={`min-h-[68px] rounded-2xl p-3 flex flex-col justify-between transition-all duration-150 relative text-left border touch-haptic ${
                                burned
                                    ? "bg-red-950/20 border-red-500/20 text-red-400/50 cursor-not-allowed opacity-60"
                                    : config
                                      ? `${config.bg} ${config.text} ${config.border} active:scale-[0.97]`
                                      : "bg-[#141824] border-white/[0.08] text-gray-300 hover:border-white/20 active:scale-[0.97]"
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-bold uppercase truncate max-w-[80%]">
                                    {player.name}
                                </span>
                                {config && (
                                    <span className="text-sm leading-none">
                                        {config.icon}
                                    </span>
                                )}
                            </div>

                            <div className="mt-1">
                                {burned ? (
                                    <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
                                        🔥 CHÁY BÀI
                                    </span>
                                ) : config ? (
                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                        {config.label}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-semibold text-gray-500">
                                        Chưa chọn hạng
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
