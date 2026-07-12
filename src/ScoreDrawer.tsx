import { useState } from "react";
import {
    X,
    Trophy,
    AlertTriangle,
    CheckCircle2,
    Pencil,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DrawerClose,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ScoreDrawerProps {
    players: string[];
    onConfirm: (scores: Record<string, number>, details?: any) => void;
    onDelete?: () => void;
    initialData?: {
        ranks?: Record<string, Rank | null>;
        anHeoSelection?: Record<string, { do: number; den: number }>;
        phatHeoSelection?: Record<string, { do: number; den: number }>;
        chetHeoSelection?: Record<string, { do: number; den: number }>;
        chetChaySelection?: Record<string, "an" | "chay" | "">;
        doiThongSelection?: Record<string, { an: number; phat: number }>;
    };
    roundNumber?: number;
}

type Rank = "NHẤT" | "NHÌ" | "BA" | "BÉT";

const rankOrder: Rank[] = ["NHẤT", "NHÌ", "BA", "BÉT"];

const rankStyles: Record<Rank, { bg: string; text: string; label: string }> = {
    NHẤT: { bg: "bg-[#d60000]", text: "text-white", label: "NHẤT" },
    NHÌ: { bg: "bg-[#e95a00]", text: "text-white", label: "NHÌ" },
    BA: { bg: "bg-[#d4a017]", text: "text-black", label: "BA" },
    BÉT: { bg: "bg-[#6b5b4b]", text: "text-white", label: "BÉT" },
};

export default function ScoreDrawer({
    players,
    onConfirm,
    initialData,
    roundNumber,
    onDelete,
}: ScoreDrawerProps) {
    const [ranks, setRanks] = useState<Record<string, Rank | null>>(
        initialData?.ranks || {},
    );
    const [activeTab, setActiveTab] = useState<string>("ĂN PHẠT HEO");
    const [anHeoSelection, setAnHeoSelection] = useState<
        Record<string, { do: number; den: number }>
    >(initialData?.anHeoSelection || {});
    const [phatHeoSelection, setPhatHeoSelection] = useState<
        Record<string, { do: number; den: number }>
    >(initialData?.phatHeoSelection || {});
    const [chetHeoSelection, setChetHeoSelection] = useState<
        Record<string, { do: number; den: number }>
    >(initialData?.chetHeoSelection || {});
    const [chetChaySelection, setChetChaySelection] = useState<
        Record<string, "an" | "chay" | "">
    >(initialData?.chetChaySelection || {});
    const [doiThongSelection, setDoiThongSelection] = useState<
        Record<string, { an: number; phat: number }>
    >(initialData?.doiThongSelection || {});

    const getGameSettings = () => {
        const query = new URLSearchParams(window.location.search);
        const gameId = query.get("id");
        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                const games = JSON.parse(stored);
                const found = games.find((g: any) => g.id === gameId);
                if (found && found.settings) return found.settings;
            }
        }
        return null;
    };

    const getChetChayPenalty = (): number => {
        const settings = getGameSettings();
        return settings?.penalties?.chetChay ?? 4;
    };

    const isPlayerBurned = (name: string): boolean => {
        return chetChaySelection[name] === "chay";
    };

    const isPlayerEater = (name: string): boolean => {
        return chetChaySelection[name] === "an";
    };

    const burnedCount = players.filter((p) => isPlayerBurned(p)).length;

    const handlePlayerClick = (name: string) => {
        // Người bị chết cháy không được tick thứ tự về đích
        if (isPlayerBurned(name)) return;

        if (ranks[name]) {
            // Remove rank
            const newRanks = { ...ranks };
            delete newRanks[name];
            setRanks(newRanks);
        } else {
            // Find next available rank
            const assignedRanks = Object.values(ranks).filter(
                Boolean,
            ) as Rank[];
            const nextRank = rankOrder.find((r) => !assignedRanks.includes(r));
            if (nextRank) {
                setRanks({
                    ...ranks,
                    [name]: nextRank,
                });
            }
        }
    };

    const toggleHeo = (
        name: string,
        color: "do" | "den",
        type: "an" | "phat" | "chet",
    ) => {
        const selection =
            type === "an"
                ? anHeoSelection
                : type === "phat"
                  ? phatHeoSelection
                  : chetHeoSelection;
        const setSelection =
            type === "an"
                ? setAnHeoSelection
                : type === "phat"
                  ? setPhatHeoSelection
                  : setChetHeoSelection;

        const current = selection[name] || { do: 0, den: 0 };
        const currentCount = current[color];

        let nextCount = 0;
        if (currentCount === 0) {
            nextCount = 1;
        } else if (currentCount === 1) {
            nextCount = 2;
        } else {
            nextCount = 0;
        }

        setSelection({
            ...selection,
            [name]: {
                ...current,
                [color]: nextCount,
            },
        });
    };

    const toggleDoiThong = (name: string, type: "an" | "phat") => {
        const current = doiThongSelection[name] || { an: 0, phat: 0 };
        const currentCount = current[type];

        let nextCount = 0;
        if (currentCount < 5) {
            nextCount = currentCount + 1;
        } else {
            nextCount = 0;
        }

        setDoiThongSelection({
            ...doiThongSelection,
            [name]: {
                ...current,
                [type]: nextCount,
            },
        });
    };

    const clearDoiThong = (name: string) => {
        setDoiThongSelection({
            ...doiThongSelection,
            [name]: { an: 0, phat: 0 },
        });
    };

    const clearAnHeo = (name: string) => {
        setAnHeoSelection({
            ...anHeoSelection,
            [name]: { do: 0, den: 0 },
        });
    };

    const clearPhatHeo = (name: string) => {
        setPhatHeoSelection({
            ...phatHeoSelection,
            [name]: { do: 0, den: 0 },
        });
    };

    const clearChetHeo = (name: string) => {
        setChetHeoSelection({
            ...chetHeoSelection,
            [name]: { do: 0, den: 0 },
        });
    };

    const clearChetChay = (name: string) => {
        setChetChaySelection({
            ...chetChaySelection,
            [name]: "",
        });
    };

    const hasActiveData = (tabName: string): boolean => {
        if (tabName === "ĂN PHẠT HEO") {
            return (
                Object.values(anHeoSelection).some(
                    (v) => v && (v.do > 0 || v.den > 0),
                ) ||
                Object.values(phatHeoSelection).some(
                    (v) => v && (v.do > 0 || v.den > 0),
                )
            );
        }
        if (tabName === "CHẾT HEO") {
            return Object.values(chetHeoSelection).some(
                (v) => v && (v.do > 0 || v.den > 0),
            );
        }
        if (tabName === "CHẾT CHÁY") {
            return Object.values(chetChaySelection).some(
                (val) => val === "an" || val === "chay",
            );
        }
        if (tabName === "ĐÔI THÔNG") {
            return Object.values(doiThongSelection).some(
                (val) => val && (val.an > 0 || val.phat > 0),
            );
        }
        return false;
    };

    const getScoreForRank = (rank: Rank | null): number => {
        let nhat = 3,
            nhi = 2,
            ba = 1,
            bet = 0;

        const settings = getGameSettings();
        if (settings) {
            nhat = settings.nhat ?? 3;
            nhi = settings.nhi ?? 2;
            ba = settings.ba ?? 1;
            bet = settings.bet ?? 0;
        }

        if (rank === "NHẤT") return nhat;
        if (rank === "NHÌ") return nhi;
        if (rank === "BA") return ba;
        if (rank === "BÉT") return bet;
        return 0;
    };

    const getHeoValues = () => {
        const settings = getGameSettings();
        return {
            do: settings?.penalties?.heoDo ?? 4,
            den: settings?.penalties?.heoDen ?? 2,
        };
    };

    const getPlayerScore = (name: string): number => {
        let score = 0;
        if (isPlayerBurned(name)) {
            score -= getChetChayPenalty();
        } else {
            score += getScoreForRank(ranks[name] || null);
        }
        // Người "ăn" được +penalty cho mỗi người bị cháy
        if (isPlayerEater(name)) {
            score += getChetChayPenalty() * burnedCount;
        }

        // Tính điểm Ăn Heo / Phạt Heo
        const heoValues = getHeoValues();
        const anHeo = anHeoSelection[name];
        if (anHeo) {
            score += heoValues.do * (anHeo.do || 0);
            score += heoValues.den * (anHeo.den || 0);
        }

        const phatHeo = phatHeoSelection[name];
        if (phatHeo) {
            score -= heoValues.do * (phatHeo.do || 0);
            score -= heoValues.den * (phatHeo.den || 0);
        }

        // Tính điểm Chết Heo (thối heo)
        const chetHeoValues = getChetHeoValues();
        const chetHeo = chetHeoSelection[name];
        if (chetHeo) {
            score -= chetHeoValues.do * (chetHeo.do || 0);
            score -= chetHeoValues.den * (chetHeo.den || 0);
        }

        // Tính điểm Đôi Thông
        // Tính điểm Đôi Thông
        const dtValue = getDoiThongPenalty();
        const dt = doiThongSelection[name];
        if (dt) {
            score += dtValue * (dt.an || 0);
            score -= dtValue * (dt.phat || 0);
        }

        return score;
    };

    const getDoiThongPenalty = (): number => {
        const settings = getGameSettings();
        return settings?.penalties?.doiThong ?? 4;
    };

    const getChetHeoValues = () => {
        const settings = getGameSettings();
        return {
            do: settings?.penalties?.chetHeoDo ?? 2,
            den: settings?.penalties?.chetHeoDen ?? 1,
        };
    };

    // Tất cả người chơi KHÔNG bị cháy phải được xếp hạng
    const activePlayers = players.filter((p) => !isPlayerBurned(p));
    const allRanked =
        activePlayers.length > 0 && activePlayers.every((p) => ranks[p]);

    const handleConfirm = () => {
        if (!allRanked) return;
        const scores: Record<string, number> = {};
        players.forEach((p) => {
            scores[p] = getPlayerScore(p);
        });
        onConfirm(scores, {
            ranks,
            anHeoSelection,
            phatHeoSelection,
            chetHeoSelection,
            chetChaySelection,
            doiThongSelection,
        });
    };

    return (
        <div className="flex flex-col h-[90vh] bg-[#0a0a0a] text-white font-sans sm:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0 bg-[#0f0f12]">
                <div className="flex items-center gap-3">
                    {initialData ? (
                        <div className="w-10 h-10 rounded-xl bg-orange-950/40 flex items-center justify-center text-orange-500">
                            <Pencil size={20} />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-950/40 flex items-center justify-center text-emerald-500">
                            <Trophy size={20} />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <DrawerTitle className="text-lg font-bold leading-tight text-white flex items-center gap-2">
                            <span>
                                {initialData ? "Chỉnh sửa" : "Ghi điểm"}
                            </span>
                            {initialData && roundNumber && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/20">
                                    ván #{roundNumber}
                                </span>
                            )}
                        </DrawerTitle>
                        <DrawerDescription className="text-[10px] text-gray-500 font-medium">
                            {initialData
                                ? "Sửa kết quả ván Tiến Lên"
                                : "Kết thúc ván Tiến Lên"}
                        </DrawerDescription>
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

                {/* Tùy chọn phạt / thưởng */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                        Tùy chọn phạt / thưởng
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "CHẾT CHÁY",
                            "ĂN PHẠT HEO",
                            "CHẾT HEO",
                            "ĐÔI THÔNG",
                        ].map((item) => {
                            const isSelected = activeTab === item;
                            return (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`px-4 py-2 rounded-xl text-xs uppercase font-bold transition-all border relative ${
                                        isSelected
                                            ? "bg-[#00a67d] text-white border-[#00a67d]"
                                            : "bg-transparent text-gray-400 border-white/10 hover:border-white/20"
                                    }`}
                                >
                                    {item}
                                    {hasActiveData(item) && (
                                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-[#0a0a0a]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Tab Panel */}
                    <div className="bg-[#151517] rounded-3xl p-5 border border-white/[0.03] space-y-4">
                        {activeTab === "ĂN PHẠT HEO" && (
                            <div className="flex flex-col gap-0">
                                {/* Header */}
                                <div className="flex items-center py-2 mb-1">
                                    <span className="w-16 text-[10px] font-bold text-gray-500 uppercase tracking-wider"></span>
                                    <div className="flex-1 flex items-center">
                                        <div className="flex-1 flex justify-center">
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                                Ăn
                                            </span>
                                        </div>
                                        <div className="w-px h-4 bg-white/10 mx-1"></div>
                                        <div className="flex-1 flex justify-center">
                                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                                Phạt
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {players.map((name) => {
                                    const anSelection = anHeoSelection[
                                        name
                                    ] || { do: 0, den: 0 };
                                    const phatSelection = phatHeoSelection[
                                        name
                                    ] || { do: 0, den: 0 };

                                    return (
                                        <div
                                            key={name}
                                            className="flex items-center py-2.5 border-t border-white/[0.04]"
                                        >
                                            <span className="w-16 text-sm font-bold text-gray-300 truncate pr-2">
                                                {name}
                                            </span>
                                            <div className="flex-1 flex items-center">
                                                {/* Cột Ăn */}
                                                <div className="flex-1 flex justify-center items-center gap-2">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                toggleHeo(
                                                                    name,
                                                                    "do",
                                                                    "an",
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                                anSelection.do >
                                                                0
                                                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                                            }`}
                                                        >
                                                            Đỏ
                                                        </button>
                                                        {anSelection.do ===
                                                            2 && (
                                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                                2
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                toggleHeo(
                                                                    name,
                                                                    "den",
                                                                    "an",
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                                anSelection.den >
                                                                0
                                                                    ? "bg-white/20 text-white border-white/30"
                                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                                            }`}
                                                        >
                                                            Đen
                                                        </button>
                                                        {anSelection.den ===
                                                            2 && (
                                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                                2
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Clear Ăn Heo */}
                                                    <button
                                                        onClick={() =>
                                                            clearAnHeo(name)
                                                        }
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent ${
                                                            anSelection.do >
                                                                0 ||
                                                            anSelection.den > 0
                                                                ? "opacity-100 cursor-pointer"
                                                                : "opacity-30 pointer-events-none"
                                                        }`}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                                {/* Separator */}
                                                <div className="w-px h-8 bg-white/10 mx-1"></div>
                                                {/* Cột Phạt */}
                                                <div className="flex-1 flex justify-center items-center gap-2">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                toggleHeo(
                                                                    name,
                                                                    "do",
                                                                    "phat",
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                                phatSelection.do >
                                                                0
                                                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                                            }`}
                                                        >
                                                            Đỏ
                                                        </button>
                                                        {phatSelection.do ===
                                                            2 && (
                                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                                2
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                toggleHeo(
                                                                    name,
                                                                    "den",
                                                                    "phat",
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                                phatSelection.den >
                                                                0
                                                                    ? "bg-white/20 text-white border-white/30"
                                                                    : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
                                                            }`}
                                                        >
                                                            Đen
                                                        </button>
                                                        {phatSelection.den ===
                                                            2 && (
                                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[9px] font-bold text-white ring-2 ring-[#151517]">
                                                                2
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Clear Phạt Heo */}
                                                    <button
                                                        onClick={() =>
                                                            clearPhatHeo(name)
                                                        }
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent ${
                                                            phatSelection.do >
                                                                0 ||
                                                            phatSelection.den >
                                                                0
                                                                ? "opacity-100 cursor-pointer"
                                                                : "opacity-30 pointer-events-none"
                                                        }`}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === "CHẾT HEO" && (
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
                                {players.map((name) => {
                                    const selection = chetHeoSelection[
                                        name
                                    ] || { do: 0, den: 0 };
                                    return (
                                        <div
                                            key={name}
                                            className="flex justify-between items-center py-2.5 border-t border-white/[0.04]"
                                        >
                                            <span className="text-sm font-bold text-gray-300">
                                                {name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            toggleHeo(
                                                                name,
                                                                "do",
                                                                "chet",
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                            selection.do > 0
                                                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                                : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
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
                                                            toggleHeo(
                                                                name,
                                                                "den",
                                                                "chet",
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                            selection.den > 0
                                                                ? "bg-white/20 text-white border-white/30"
                                                                : "bg-transparent text-gray-600 border-white/5 hover:border-white/10"
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
                                                    onClick={() =>
                                                        clearChetHeo(name)
                                                    }
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-gray-600 hover:text-red-400 bg-transparent ${
                                                        selection.do > 0 ||
                                                        selection.den > 0
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
                        )}

                        {activeTab === "CHẾT CHÁY" && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        Người chơi
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        Hệ số: {getChetChayPenalty()} điểm
                                    </span>
                                </div>
                                {players.map((name) => {
                                    const status =
                                        chetChaySelection[name] || "";
                                    const isAn = status === "an";
                                    const isChay = status === "chay";

                                    const handleToggle = (
                                        type: "an" | "chay",
                                    ) => {
                                        const newSelection = {
                                            ...chetChaySelection,
                                        };

                                        if (type === "an") {
                                            if (isAn) {
                                                // Bỏ chọn ăn
                                                newSelection[name] = "";
                                            } else {
                                                // Xóa người ăn cũ (chỉ 1 người được ăn)
                                                Object.keys(
                                                    newSelection,
                                                ).forEach((key) => {
                                                    if (
                                                        newSelection[key] ===
                                                        "an"
                                                    )
                                                        newSelection[key] = "";
                                                });
                                                newSelection[name] = "an";
                                            }
                                        } else {
                                            if (isChay) {
                                                newSelection[name] = "";
                                            } else {
                                                newSelection[name] = "chay";
                                                // Nếu bị cháy -> xóa rank đã chọn
                                                if (ranks[name]) {
                                                    const newRanks = {
                                                        ...ranks,
                                                    };
                                                    delete newRanks[name];
                                                    setRanks(newRanks);
                                                }
                                            }
                                        }

                                        setChetChaySelection(newSelection);
                                    };

                                    return (
                                        <div
                                            key={name}
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
                                                {name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleToggle("an")
                                                    }
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                                        isAn
                                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                            : "bg-transparent text-gray-500 border-white/5 hover:border-white/10"
                                                    }`}
                                                >
                                                    ĂN
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggle("chay")
                                                    }
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
                                                    onClick={() =>
                                                        clearChetChay(name)
                                                    }
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
                        )}

                        {activeTab === "ĐÔI THÔNG" && (
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
                                {players.map((name) => {
                                    const selection = doiThongSelection[
                                        name
                                    ] || { an: 0, phat: 0 };
                                    const hasData =
                                        selection.an > 0 || selection.phat > 0;

                                    return (
                                        <div
                                            key={name}
                                            className="flex justify-between items-center py-2.5 border-t border-white/[0.04]"
                                        >
                                            <span className="text-sm font-bold text-gray-300">
                                                {name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {/* Button Ăn */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            toggleDoiThong(
                                                                name,
                                                                "an",
                                                            )
                                                        }
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
                                                        onClick={() =>
                                                            toggleDoiThong(
                                                                name,
                                                                "phat",
                                                            )
                                                        }
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
                                                    onClick={() =>
                                                        clearDoiThong(name)
                                                    }
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
                        )}
                    </div>
                </div>

                {/* Tong ket van nay */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                        Tổng kết ván này
                    </h3>
                    <div className="bg-[#151517] rounded-3xl p-5 border border-white/[0.03] space-y-4">
                        {players.map((name) => {
                            const burned = isPlayerBurned(name);
                            const eater = isPlayerEater(name);
                            const score = getPlayerScore(name);
                            return (
                                <div
                                    key={name}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-sm font-bold ${burned ? "text-red-400" : eater ? "text-emerald-400" : "text-gray-300"}`}
                                        >
                                            {name}
                                        </span>
                                        {burned && (
                                            <span className="text-[9px] font-bold text-red-400/70 bg-red-500/10 px-1.5 py-0.5 rounded">
                                                CHÁY
                                            </span>
                                        )}
                                        {eater && burnedCount > 0 && (
                                            <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                ĂN +
                                                {getChetChayPenalty() *
                                                    burnedCount}
                                            </span>
                                        )}
                                        {(() => {
                                            const heoValues = getHeoValues();
                                            const anHeo = anHeoSelection[name];
                                            const phatHeo =
                                                phatHeoSelection[name];
                                            return (
                                                <>
                                                    {anHeo && (
                                                        <>
                                                            {anHeo.do > 0 && (
                                                                <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                                    HEO ĐỎ
                                                                    {anHeo.do >
                                                                    1
                                                                        ? ` x${anHeo.do}`
                                                                        : ""}{" "}
                                                                    (+
                                                                    {heoValues.do *
                                                                        anHeo.do}
                                                                    )
                                                                </span>
                                                            )}
                                                            {anHeo.den > 0 && (
                                                                <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                                    HEO ĐEN
                                                                    {anHeo.den >
                                                                    1
                                                                        ? ` x${anHeo.den}`
                                                                        : ""}{" "}
                                                                    (+
                                                                    {heoValues.den *
                                                                        anHeo.den}
                                                                    )
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                    {phatHeo && (
                                                        <>
                                                            {phatHeo.do > 0 && (
                                                                <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                    PHẠT HEO ĐỎ
                                                                    {phatHeo.do >
                                                                    1
                                                                        ? ` x${phatHeo.do}`
                                                                        : ""}{" "}
                                                                    (-
                                                                    {heoValues.do *
                                                                        phatHeo.do}
                                                                    )
                                                                </span>
                                                            )}
                                                            {phatHeo.den >
                                                                0 && (
                                                                <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                    PHẠT HEO ĐEN
                                                                    {phatHeo.den >
                                                                    1
                                                                        ? ` x${phatHeo.den}`
                                                                        : ""}{" "}
                                                                    (-
                                                                    {heoValues.den *
                                                                        phatHeo.den}
                                                                    )
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                    {(() => {
                                                        const chetHeoValues =
                                                            getChetHeoValues();
                                                        const chetHeo =
                                                            chetHeoSelection[
                                                                name
                                                            ];
                                                        if (!chetHeo)
                                                            return null;
                                                        return (
                                                            <>
                                                                {chetHeo.do >
                                                                    0 && (
                                                                    <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                        THỐI HEO
                                                                        ĐỎ
                                                                        {chetHeo.do >
                                                                        1
                                                                            ? ` x${chetHeo.do}`
                                                                            : ""}{" "}
                                                                        (-
                                                                        {chetHeoValues.do *
                                                                            chetHeo.do}
                                                                        )
                                                                    </span>
                                                                )}
                                                                {chetHeo.den >
                                                                    0 && (
                                                                    <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                        THỐI HEO
                                                                        ĐEN
                                                                        {chetHeo.den >
                                                                        1
                                                                            ? ` x${chetHeo.den}`
                                                                            : ""}{" "}
                                                                        (-
                                                                        {chetHeoValues.den *
                                                                            chetHeo.den}
                                                                        )
                                                                    </span>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                    {(() => {
                                                        const dtValue =
                                                            getDoiThongPenalty();
                                                        const dt =
                                                            doiThongSelection[
                                                                name
                                                            ];
                                                        if (!dt) return null;
                                                        return (
                                                            <>
                                                                {dt.an > 0 && (
                                                                    <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                                        ĐÔI
                                                                        THÔNG
                                                                        {dt.an >
                                                                        1
                                                                            ? ` x${dt.an}`
                                                                            : ""}{" "}
                                                                        (+
                                                                        {dtValue *
                                                                            dt.an}
                                                                        )
                                                                    </span>
                                                                )}
                                                                {dt.phat >
                                                                    0 && (
                                                                    <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                        PHẠT ĐÔI
                                                                        THÔNG
                                                                        {dt.phat >
                                                                        1
                                                                            ? ` x${dt.phat}`
                                                                            : ""}{" "}
                                                                        (-
                                                                        {dtValue *
                                                                            dt.phat}
                                                                        )
                                                                    </span>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <span
                                        className={`text-sm font-bold ${
                                            score > 0
                                                ? "text-emerald-500"
                                                : score < 0
                                                  ? "text-red-400"
                                                  : "text-gray-500"
                                        }`}
                                    >
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

                <div className="flex gap-3 w-full">
                    {initialData && onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-14 px-4 rounded-2xl bg-red-950/20 hover:bg-red-950/40 text-red-500 border border-red-500/20 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                                >
                                    <Trash2 size={20} className="size-5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                                size="sm"
                                className="bg-[#0a0a0a] border-white/5 text-white max-w-[90vw] rounded-2xl"
                            >
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-lg font-bold text-white">
                                        Xác nhận xóa ván đấu
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-gray-400">
                                        Bạn có chắc chắn muốn xóa ván #
                                        {roundNumber} này không? Hành động này
                                        không thể hoàn tác.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="h-11 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-white">
                                        Hủy
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onDelete}
                                        className="h-11 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 border-0"
                                    >
                                        Xóa
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <DrawerClose
                        asChild
                        disabled={!allRanked}
                        className="flex-1"
                    >
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
        </div>
    );
}
