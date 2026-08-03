import { X } from "lucide-react";
import type { Player } from "./types";

interface ChetHeoPanelProps {
    players: Player[];
    chetHeoSelection: Record<string, { do: number; den: number }>;
    toggleHeo: (
        id: string,
        color: "do" | "den",
        type: "an" | "phat" | "chet",
    ) => void;
    clearChetHeo: (id: string) => void;
}

export default function ChetHeoPanel({
    players,
    chetHeoSelection,
    toggleHeo,
    clearChetHeo,
}: ChetHeoPanelProps) {
    return (
        <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="flex items-center py-2 mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Người chơi
                </span>
                <span className="ml-auto text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Thối Heo (Trừ điểm)
                </span>
            </div>
            {players.map((player) => {
                const selection = chetHeoSelection[player.id] || {
                    do: 0,
                    den: 0,
                };
                return (
                    <div
                        key={player.id}
                        className="flex justify-between items-center py-2.5 border-t border-white/[0.04]"
                    >
                        <span className="text-sm font-bold text-gray-300">
                            {player.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        toggleHeo(player.id, "do", "chet")
                                    }
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                        selection.do > 0
                                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                                            : "bg-transparent text-gray-500 border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    Đỏ
                                </button>
                                {selection.do === 2 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                        2
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        toggleHeo(player.id, "den", "chet")
                                    }
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                        selection.den > 0
                                            ? "bg-white/20 text-white border-white/30"
                                            : "bg-transparent text-gray-500 border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    Đen
                                </button>
                                {selection.den === 2 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                        2
                                    </span>
                                )}
                            </div>
                            {/* Clear Button */}
                            <button
                                onClick={() => clearChetHeo(player.id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent ${
                                    selection.do > 0 || selection.den > 0
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
