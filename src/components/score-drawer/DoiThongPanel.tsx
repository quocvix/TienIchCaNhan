import { X } from "lucide-react";
import type { Player } from "./types";

interface DoiThongPanelProps {
    players: Player[];
    doiThongSelection: Record<string, { an: number; phat: number }>;
    toggleDoiThong: (id: string, type: "an" | "phat") => void;
    clearDoiThong: (id: string) => void;
    getDoiThongPenalty: () => number;
}

export default function DoiThongPanel({
    players,
    doiThongSelection,
    toggleDoiThong,
    clearDoiThong,
    getDoiThongPenalty,
}: DoiThongPanelProps) {
    return (
        <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="flex items-center py-2 mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Người chơi
                </span>
                <span className="ml-auto text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Ăn/Phạt (Hệ số: {getDoiThongPenalty()})
                </span>
            </div>
            {players.map((player) => {
                const selection = doiThongSelection[player.id] || { an: 0, phat: 0 };
                const hasData = selection.an > 0 || selection.phat > 0;

                return (
                    <div
                        key={player.id}
                        className="flex justify-between items-center py-2.5 border-t border-white/[0.04]"
                    >
                        <span className="text-sm font-bold text-gray-300">
                            {player.name}
                        </span>
                        <div className="flex items-center gap-2">
                            {/* Button Ăn */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDoiThong(player.id, "an")}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                        selection.an > 0
                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    Ăn
                                </button>
                                {selection.an > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                        {selection.an}
                                    </span>
                                )}
                            </div>
                            {/* Button Phạt */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDoiThong(player.id, "phat")}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                        selection.phat > 0
                                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                                            : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    Phạt
                                </button>
                                {selection.phat > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                        {selection.phat}
                                    </span>
                                )}
                            </div>
                            {/* Clear Button */}
                            <button
                                onClick={() => clearDoiThong(player.id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent ${
                                    hasData
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
