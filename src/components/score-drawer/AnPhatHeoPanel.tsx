import { X } from "lucide-react";

interface AnPhatHeoPanelProps {
    players: string[];
    anHeoSelection: Record<string, { do: number; den: number }>;
    phatHeoSelection: Record<string, { do: number; den: number }>;
    toggleHeo: (
        name: string,
        color: "do" | "den",
        type: "an" | "phat" | "chet",
    ) => void;
    clearAnHeo: (name: string) => void;
    clearPhatHeo: (name: string) => void;
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
        <div className="flex flex-col gap-0 w-full">
            {players.map((name) => {
                const anSelection = anHeoSelection[name] || { do: 0, den: 0 };
                const phatSelection = phatHeoSelection[name] || { do: 0, den: 0 };

                return (
                    <div
                        key={name}
                        className="flex items-center py-4 border-t border-white/[0.04] first:border-t-0"
                    >
                        {/* Player name on the left */}
                        <div className="w-16 shrink-0 text-sm font-bold text-gray-300 truncate pr-2 border-r border-white/5 h-12 flex items-center">
                            {name}
                        </div>

                        {/* Stacked controls on the right */}
                        <div className="flex-1 flex flex-col gap-2.5 pl-4 items-end">
                            {/* Row Ăn */}
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                                    Ăn
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                toggleHeo(name, "do", "an")
                                            }
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                anSelection.do > 0
                                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đỏ
                                        </button>
                                        {anSelection.do === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                2
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                toggleHeo(name, "den", "an")
                                            }
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                anSelection.den > 0
                                                    ? "bg-white/20 text-white border-white/30"
                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đen
                                        </button>
                                        {anSelection.den === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                2
                                            </span>
                                        )}
                                    </div>
                                    {/* Clear Ăn Heo */}
                                    <button
                                        onClick={() => clearAnHeo(name)}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent shrink-0 ${
                                            anSelection.do > 0 || anSelection.den > 0
                                                ? "opacity-100 cursor-pointer"
                                                : "opacity-30 pointer-events-none"
                                        }`}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Row Phạt */}
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-[11px] font-bold text-red-400 uppercase tracking-wider">
                                    Phạt
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                toggleHeo(name, "do", "phat")
                                            }
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                phatSelection.do > 0
                                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đỏ
                                        </button>
                                        {phatSelection.do === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                2
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                toggleHeo(name, "den", "phat")
                                            }
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                phatSelection.den > 0
                                                    ? "bg-white/20 text-white border-white/30"
                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            Đen
                                        </button>
                                        {phatSelection.den === 2 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                2
                                            </span>
                                        )}
                                    </div>
                                    {/* Clear Phạt Heo */}
                                    <button
                                        onClick={() => clearPhatHeo(name)}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent shrink-0 ${
                                            phatSelection.do > 0 || phatSelection.den > 0
                                                ? "opacity-100 cursor-pointer"
                                                : "opacity-30 pointer-events-none"
                                        }`}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
