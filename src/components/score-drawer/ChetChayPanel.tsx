import { X } from "lucide-react";
import type { Player, Rank } from "./types";

interface ChetChayPanelProps {
    players: Player[];
    chetChaySelection: Record<string, "an" | "chay" | "">;
    ranks: Record<string, Rank | null>;
    setRanks: React.Dispatch<React.SetStateAction<Record<string, Rank | null>>>;
    setChetChaySelection: React.Dispatch<
        React.SetStateAction<Record<string, "an" | "chay" | "">>
    >;
    clearChetChay: (id: string) => void;
    getChetChayPenalty: () => number;
}

export default function ChetChayPanel({
    players,
    chetChaySelection,
    ranks,
    setRanks,
    setChetChaySelection,
    clearChetChay,
    getChetChayPenalty,
}: ChetChayPanelProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Người chơi
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Hệ số: {getChetChayPenalty()} điểm
                </span>
            </div>
            {players.map((player) => {
                const status = chetChaySelection[player.id] || "";
                const isAn = status === "an";
                const isChay = status === "chay";

                const handleToggle = (type: "an" | "chay") => {
                    const newSelection = {
                        ...chetChaySelection,
                    };

                    if (type === "an") {
                        if (isAn) {
                            newSelection[player.id] = "";
                        } else {
                            // Xóa người ăn cũ (chỉ 1 người được ăn)
                            Object.keys(newSelection).forEach((key) => {
                                if (newSelection[key] === "an") {
                                    newSelection[key] = "";
                                }
                            });
                            newSelection[player.id] = "an";
                        }
                    } else {
                        if (isChay) {
                            newSelection[player.id] = "";
                        } else {
                            newSelection[player.id] = "chay";
                            // Nếu bị cháy -> xóa rank đã chọn
                            if (ranks[player.id]) {
                                const newRanks = {
                                    ...ranks,
                                };
                                delete newRanks[player.id];
                                setRanks(newRanks);
                            }
                        }
                    }

                    setChetChaySelection(newSelection);
                };

                return (
                    <div
                        key={player.id}
                        className="flex justify-between items-center py-2"
                    >
                        <span
                            className={`text-sm font-bold ${
                                isAn
                                    ? "text-emerald-400"
                                    : isChay
                                      ? "text-red-400"
                                      : "text-gray-300"
                            }`}
                        >
                            {player.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleToggle("an")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                    isAn
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                        : "bg-transparent text-gray-500 border-white/5 hover:border-white/10"
                                }`}
                            >
                                ĂN
                            </button>
                            <button
                                onClick={() => handleToggle("chay")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                    isChay
                                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                                        : "bg-transparent text-gray-500 border-white/5 hover:border-white/10"
                                }`}
                            >
                                CHÁY
                            </button>
                            {/* Clear Button */}
                            <button
                                onClick={() => clearChetChay(player.id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent ${
                                    status !== ""
                                        ? "opacity-100 cursor-pointer"
                                        : "opacity-30 pointer-events-none"
                                }`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
