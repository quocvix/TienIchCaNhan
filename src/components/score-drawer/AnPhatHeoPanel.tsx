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
            {/* Header */}
            <div className="flex items-center py-2 mb-1">
                <span className="w-14 text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0"></span>
                <div className="flex-1 flex items-center">
                    <div className="flex-1 flex justify-center">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                            Ăn
                        </span>
                    </div>
                    <div className="w-px h-4 bg-white/10 mx-0.5"></div>
                    <div className="flex-1 flex justify-center">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                            Phạt
                        </span>
                    </div>
                </div>
            </div>
            {players.map((name) => {
                const anSelection = anHeoSelection[name] || { do: 0, den: 0 };
                const phatSelection = phatHeoSelection[name] || { do: 0, den: 0 };

                return (
                    <div
                        key={name}
                        className="flex items-center py-2 border-t border-white/[0.04]"
                    >
                        <span className="w-14 text-xs font-bold text-gray-300 truncate pr-1 shrink-0">
                            {name}
                        </span>
                        <div className="flex-1 flex items-center min-w-0">
                            {/* Cột Ăn */}
                            <div className="flex-1 flex justify-center items-center gap-1.5">
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            toggleHeo(name, "do", "an")
                                        }
                                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all border ${
                                            anSelection.do > 0
                                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                        }`}
                                    >
                                        Đỏ
                                    </button>
                                    {anSelection.do === 2 && (
                                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-[#151517]">
                                            2
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            toggleHeo(name, "den", "an")
                                        }
                                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all border ${
                                            anSelection.den > 0
                                                ? "bg-white/20 text-white border-white/30"
                                                : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                        }`}
                                    >
                                        Đen
                                    </button>
                                    {anSelection.den === 2 && (
                                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-500 text-[8px] font-bold text-white ring-2 ring-[#151517]">
                                            2
                                        </span>
                                    )}
                                </div>
                                {/* Clear Ăn Heo */}
                                <button
                                    onClick={() => clearAnHeo(name)}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent shrink-0 ${
                                        anSelection.do > 0 || anSelection.den > 0
                                            ? "opacity-100 cursor-pointer"
                                            : "opacity-30 pointer-events-none"
                                    }`}
                                >
                                    <X size={10} />
                                </button>
                            </div>
                            {/* Separator */}
                            <div className="w-px h-6 bg-white/10 mx-0.5 shrink-0"></div>
                            {/* Cột Phạt */}
                            <div className="flex-1 flex justify-center items-center gap-1.5">
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            toggleHeo(name, "do", "phat")
                                        }
                                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all border ${
                                            phatSelection.do > 0
                                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                        }`}
                                    >
                                        Đỏ
                                    </button>
                                    {phatSelection.do === 2 && (
                                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-[#151517]">
                                            2
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            toggleHeo(name, "den", "phat")
                                        }
                                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all border ${
                                            phatSelection.den > 0
                                                ? "bg-white/20 text-white border-white/30"
                                                : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                        }`}
                                    >
                                        Đen
                                    </button>
                                    {phatSelection.den === 2 && (
                                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-500 text-[8px] font-bold text-white ring-2 ring-[#151517]">
                                            2
                                        </span>
                                    )}
                                </div>
                                {/* Clear Phạt Heo */}
                                <button
                                    onClick={() => clearPhatHeo(name)}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent shrink-0 ${
                                        phatSelection.do > 0 || phatSelection.den > 0
                                            ? "opacity-100 cursor-pointer"
                                            : "opacity-30 pointer-events-none"
                                    }`}
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
