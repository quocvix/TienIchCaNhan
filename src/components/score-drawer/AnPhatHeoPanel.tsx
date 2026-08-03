import { X } from "lucide-react";
import type { Player } from "./types";

interface AnPhatHeoPanelProps {
    players: Player[];
    anHeoSelection: Record<string, { do: number; den: number }>;
    phatHeoSelection: Record<string, { do: number; den: number }>;
    toggleHeo: (
        id: string,
        color: "do" | "den",
        type: "an" | "phat" | "chet",
    ) => void;
    clearAnHeo: (id: string) => void;
    clearPhatHeo: (id: string) => void;
}

export default function AnPhatHeoPanel({
    players,
    anHeoSelection,
    phatHeoSelection,
    toggleHeo,
    clearAnHeo,
    clearPhatHeo,
}: AnPhatHeoPanelProps) {
    return (
        <div className="flex flex-col gap-3 w-full">
            {players.map((player) => {
                const anSelection = anHeoSelection[player.id] || {
                    do: 0,
                    den: 0,
                };
                const phatSelection = phatHeoSelection[player.id] || {
                    do: 0,
                    den: 0,
                };

                return (
                    <div
                        key={player.id}
                        className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-3.5 flex flex-col gap-3"
                    >
                        {/* Player Name Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-xs font-bold text-gray-200">
                                {player.name}
                            </span>
                        </div>

                        {/* Split 2 Columns: Left = Ăn, Right = Phạt */}
                        <div className="grid grid-cols-2 gap-3 divide-x divide-white/5">
                            {/* Left Column: Ăn Heo */}
                            <div className="flex flex-col gap-2 pr-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                        Ăn Heo
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => clearAnHeo(player.id)}
                                        className={`text-gray-500 hover:text-red-400 p-0.5 transition-all ${
                                            anSelection.do > 0 ||
                                            anSelection.den > 0
                                                ? "opacity-100 cursor-pointer"
                                                : "opacity-0 pointer-events-none"
                                        }`}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleHeo(player.id, "do", "an")
                                            }
                                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                                                anSelection.do > 0
                                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                    : "bg-[#121214] text-gray-400 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đỏ
                                        </button>
                                        {anSelection.do === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#1c1c1e]">
                                                2
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative flex-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleHeo(
                                                    player.id,
                                                    "den",
                                                    "an",
                                                )
                                            }
                                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                                                anSelection.den > 0
                                                    ? "bg-white/20 text-white border-white/30"
                                                    : "bg-[#121214] text-gray-400 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đen
                                        </button>
                                        {anSelection.den === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white ring-2 ring-[#1c1c1e]">
                                                2
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Phạt Heo */}
                            <div className="flex flex-col gap-2 pl-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                        Phạt Heo
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => clearPhatHeo(player.id)}
                                        className={`text-gray-500 hover:text-red-400 p-0.5 transition-all ${
                                            phatSelection.do > 0 ||
                                            phatSelection.den > 0
                                                ? "opacity-100 cursor-pointer"
                                                : "opacity-0 pointer-events-none"
                                        }`}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleHeo(
                                                    player.id,
                                                    "do",
                                                    "phat",
                                                )
                                            }
                                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                                                phatSelection.do > 0
                                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                    : "bg-[#121214] text-gray-400 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đỏ
                                        </button>
                                        {phatSelection.do === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#1c1c1e]">
                                                2
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative flex-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleHeo(
                                                    player.id,
                                                    "den",
                                                    "phat",
                                                )
                                            }
                                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                                                phatSelection.den > 0
                                                    ? "bg-white/20 text-white border-white/30"
                                                    : "bg-[#121214] text-gray-400 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đen
                                        </button>
                                        {phatSelection.den === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white ring-2 ring-[#1c1c1e]">
                                                2
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
