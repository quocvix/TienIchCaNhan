import React, { useState } from "react";
import { X, Trophy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";

interface ScoreDrawerProps {
    players: string[];
    onConfirm: (scores: Record<string, number>) => void;
}

type Rank = "NHẤT" | "NHÌ" | "BA" | "BÉT";

const rankOrder: Rank[] = ["NHẤT", "NHÌ", "BA", "BÉT"];

const rankStyles: Record<Rank, { bg: string; text: string; label: string }> = {
    NHẤT: { bg: "bg-[#d60000]", text: "text-white", label: "NHẤT" },
    NHÌ: { bg: "bg-[#e95a00]", text: "text-white", label: "NHÌ" },
    BA: { bg: "bg-[#d4a017]", text: "text-black", label: "BA" },
    BÉT: { bg: "bg-[#6b5b4b]", text: "text-white", label: "BÉT" }
};

export default function ScoreDrawer({ players, onConfirm }: ScoreDrawerProps) {
    const [ranks, setRanks] = useState<Record<string, Rank | null>>({});
    const [selectedPenalties, setSelectedPenalties] = useState<string[]>([]);

    const handlePlayerClick = (name: string) => {
        if (ranks[name]) {
            // Remove rank
            const newRanks = { ...ranks };
            delete newRanks[name];
            setRanks(newRanks);
        } else {
            // Find next available rank
            const assignedRanks = Object.values(ranks).filter(Boolean) as Rank[];
            const nextRank = rankOrder.find((r) => !assignedRanks.includes(r));
            if (nextRank) {
                setRanks({
                    ...ranks,
                    [name]: nextRank
                });
            }
        }
    };

    const togglePenalty = (penalty: string) => {
        if (selectedPenalties.includes(penalty)) {
            setSelectedPenalties(selectedPenalties.filter((p) => p !== penalty));
        } else {
            setSelectedPenalties([...selectedPenalties, penalty]);
        }
    };

    const getScoreForRank = (rank: Rank | null): number => {
        if (rank === "NHẤT") return 3;
        if (rank === "NHÌ") return 2;
        if (rank === "BA") return 1;
        return 0;
    };

    const allRanked = players.every((p) => ranks[p]);

    const handleConfirm = () => {
        if (!allRanked) return;
        const scores: Record<string, number> = {};
        players.forEach((p) => {
            scores[p] = getScoreForRank(ranks[p] || null);
        });
        onConfirm(scores);
    };

    return (
        <div className="flex flex-col h-[90vh] bg-[#0a0a0a] text-white font-sans sm:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0 bg-[#0f0f12]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/40 flex items-center justify-center text-emerald-500">
                        <Trophy size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-tight text-white">
                            Ghi điểm
                        </h1>
                        <span className="text-[10px] text-gray-500 font-medium">
                            Kết thúc ván Tiến Lên
                        </span>
                    </div>
                </div>
                <DrawerClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-gray-300"
                    >
                        <X size={18} />
                    </Button>
                </DrawerClose>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Thu tu ve dich */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                        Thứ tự về đích
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                        {players.map((name) => {
                            const rank = ranks[name];
                            const style = rank ? rankStyles[rank] : null;

                            return (
                                <button
                                    key={name}
                                    onClick={() => handlePlayerClick(name)}
                                    className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                                        style 
                                            ? `${style.bg} ${style.text}` 
                                            : "bg-[#151517] border border-white/[0.03] text-gray-300"
                                    }`}
                                >
                                    <span className="text-sm font-bold truncate max-w-[90%]">
                                        {name}
                                    </span>
                                    {style && (
                                        <span className="text-[9px] font-black uppercase tracking-wider opacity-90">
                                            {style.label}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tuy chon phat / thuong */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                        Tùy chọn phạt / thưởng
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {["TỚI TRẮNG", "ĂN HEO", "PHẠT HEO", "ĐÔI THÔNG"].map((item) => {
                            const isSelected = selectedPenalties.includes(item);
                            return (
                                <button
                                    key={item}
                                    onClick={() => togglePenalty(item)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        isSelected
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent text-gray-400 border-white/10 hover:border-white/20"
                                    }`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tong ket van nay */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                        Tổng kết ván này
                    </h3>
                    <div className="bg-[#151517] rounded-3xl p-5 border border-white/[0.03] space-y-4">
                        {players.map((name) => {
                            const rank = ranks[name];
                            const score = getScoreForRank(rank || null);
                            return (
                                <div key={name} className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-300">
                                        {name}
                                    </span>
                                    <span className={`text-sm font-bold ${
                                        score > 0 
                                            ? "text-emerald-500" 
                                            : "text-gray-500"
                                    }`}>
                                        {score > 0 ? `+${score}` : score}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 shrink-0 bg-[#0f0f12] flex flex-col gap-3">
                {!allRanked && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-[#2a1b14] border border-orange-950/40 text-[#df8743] rounded-2xl text-xs font-bold">
                        <AlertTriangle size={14} />
                        Vui lòng chọn thứ tự về đích
                    </div>
                )}
                
                <DrawerClose asChild disabled={!allRanked}>
                    <Button
                        onClick={handleConfirm}
                        disabled={!allRanked}
                        className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-base transition-all ${
                            allRanked
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95"
                                : "bg-emerald-950/30 text-emerald-900/60 cursor-not-allowed"
                        }`}
                    >
                        <CheckCircle2 size={18} />
                        Xác nhận ghi điểm
                    </Button>
                </DrawerClose>
            </div>
        </div>
    );
}
