import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus, Plus, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";
import AddPlayerDrawer from "./AddPlayerDrawer.tsx";
import ScoreDrawer from "./ScoreDrawer.tsx";
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

import type { Player } from "@/types";
import { useVisualViewport } from "./hooks/useVisualViewport";

export default function GameRoom() {
    const navigate = useNavigate();
    const { bottomOffset } = useVisualViewport();

    const query = new URLSearchParams(window.location.search);
    const gameId = query.get("id");

    const [players, setPlayers] = useState<Player[]>(() => {
        if (!gameId) return [];
        const stored = localStorage.getItem("game_history");
        if (stored) {
            try {
                const games = JSON.parse(stored);
                const found = games.find((g: any) => g.id === gameId);
                if (found && found.players) {
                    return found.players.map((p: any) =>
                        typeof p === "string" ? { id: p, name: p } : p,
                    );
                }
            } catch (e) {
                console.error(e);
            }
        }
        return [];
    });

    const [history, setHistory] = useState<any[]>(() => {
        if (!gameId) return [];
        const stored = localStorage.getItem("game_history");
        if (stored) {
            try {
                const games = JSON.parse(stored);
                const found = games.find((g: any) => g.id === gameId);
                if (found) return found.history || [];
            } catch (e) {
                console.error(e);
            }
        }
        return [];
    });

    const [editingRoundIndex, setEditingRoundIndex] = useState<number | null>(
        null,
    );
    const [isScoreDrawerOpen, setIsScoreDrawerOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

    const [time] = useState(() => {
        if (!gameId) return "09/07 17:33";
        const stored = localStorage.getItem("game_history");
        if (stored) {
            try {
                const games = JSON.parse(stored);
                const found = games.find((g: any) => g.id === gameId);
                if (found && found.time) return found.time;
            } catch (e) {
                console.error(e);
            }
        }
        return "09/07 17:33";
    });

    useEffect(() => {
        if (!gameId) return;
        const stored = localStorage.getItem("game_history");
        if (stored) {
            try {
                const games = JSON.parse(stored);
                const updated = games.map((g: any) => {
                    if (g.id === gameId) {
                        return { ...g, players, history };
                    }
                    return g;
                });
                localStorage.setItem("game_history", JSON.stringify(updated));
            } catch (e) {
                console.error(e);
            }
        }
    }, [players, history, gameId]);

    const hasPlayers = players.length > 0;
    const roundCount = history.length;

    const handleConfirmPlayers = (newPlayers: Player[]) => {
        const activePlayers = newPlayers.filter((p) => p.name.trim() !== "");
        setPlayers(activePlayers);
        setIsAddPlayerOpen(false);

        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                try {
                    const games = JSON.parse(stored);
                    const updated = games.map((g: any) => {
                        if (g.id === gameId) {
                            return { ...g, players: activePlayers };
                        }
                        return g;
                    });
                    localStorage.setItem(
                        "game_history",
                        JSON.stringify(updated),
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    const handleConfirmScore = (
        scores: Record<string, number>,
        details?: any,
    ) => {
        let latestHistory = history;
        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                try {
                    const games = JSON.parse(stored);
                    const found = games.find((g: any) => g.id === gameId);
                    if (found && found.history) {
                        latestHistory = found.history;
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }

        const newRound = {
            scores,
            details,
        };

        let newHistory;
        if (editingRoundIndex !== null) {
            newHistory = [...latestHistory];
            newHistory[editingRoundIndex] = newRound;
        } else {
            newHistory = [...latestHistory, newRound];
        }

        setHistory(newHistory);
        setIsScoreDrawerOpen(false);
        setEditingRoundIndex(null);

        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                try {
                    const games = JSON.parse(stored);
                    const updated = games.map((g: any) => {
                        if (g.id === gameId) {
                            return { ...g, history: newHistory };
                        }
                        return g;
                    });
                    localStorage.setItem(
                        "game_history",
                        JSON.stringify(updated),
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    const handleDeleteRound = () => {
        if (editingRoundIndex === null) return;

        const newHistory = history.filter(
            (_, idx) => idx !== editingRoundIndex,
        );
        setHistory(newHistory);
        setIsScoreDrawerOpen(false);
        setEditingRoundIndex(null);

        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                try {
                    const games = JSON.parse(stored);
                    const updated = games.map((g: any) => {
                        if (g.id === gameId) {
                            return { ...g, history: newHistory };
                        }
                        return g;
                    });
                    localStorage.setItem(
                        "game_history",
                        JSON.stringify(updated),
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    const handleResetHistory = () => {
        setHistory([]);
        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                try {
                    const games = JSON.parse(stored);
                    const updated = games.map((g: any) => {
                        if (g.id === gameId) {
                            return { ...g, history: [] };
                        }
                        return g;
                    });
                    localStorage.setItem(
                        "game_history",
                        JSON.stringify(updated),
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    const getPlayerTotal = (playerId: string) => {
        return history.reduce((sum, round) => {
            const roundScores = round.scores || round;
            return sum + (roundScores[playerId] ?? 0);
        }, 0);
    };

    return (
        <div className="flex-1 w-full h-full flex flex-col min-h-0 bg-[#07090E] text-white font-sans relative overflow-hidden select-none">
            {/* Top Navigation Bar */}
            <div className="h-14 px-3 flex items-center justify-between bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/[0.08] shrink-0 z-20">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white shrink-0 active:scale-95 transition-transform"
                >
                    <ArrowLeft size={18} />
                </Button>

                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-white tracking-wide">
                        Tiến Lên Miền Nam
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono text-gray-400">
                            {time}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span className="text-[10px] font-bold text-emerald-400">
                            Ván {roundCount}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Add / Edit Players Drawer Trigger */}
                    <Drawer
                        open={isAddPlayerOpen}
                        onOpenChange={setIsAddPlayerOpen}
                    >
                        <DrawerTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                            >
                                <UserPlus size={16} />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-[#0c101b] border-white/10 outline-none overflow-hidden p-0 max-h-[85vh]">
                            <AddPlayerDrawer
                                initialPlayers={players}
                                onConfirm={handleConfirmPlayers}
                            />
                        </DrawerContent>
                    </Drawer>

                    {/* Leaderboard / Report Modal with Confirmation */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            >
                                <Trophy size={16} />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            size="sm"
                            className="bg-[#0f1422] border-white/10 text-white rounded-3xl p-6"
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-white text-base font-bold">
                                    Xem báo cáo tổng kết?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center text-gray-400 text-xs">
                                    Xác nhận hiển thị bảng điểm số chi tiết của
                                    tất cả người chơi. Điểm số và thứ hạng sẽ
                                    được công khai.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-2.5 mt-2">
                                <AlertDialogCancel className="flex-1 rounded-xl h-11 bg-white/5 border-white/10 text-white">
                                    Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => setIsReportOpen(true)}
                                    className="flex-1 rounded-xl h-11 bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/20 border-0"
                                >
                                    Xem ngay
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Reset History Alert */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <RotateCcw size={15} />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            size="sm"
                            className="bg-[#0f1422] border-white/10 text-white rounded-3xl p-6"
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-white text-base font-bold">
                                    Làm mới bàn chơi?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center text-gray-400 text-xs">
                                    Toàn bộ lịch sử điểm số của các ván sẽ về 0.
                                    Danh sách người chơi vẫn được giữ nguyên.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-2.5 mt-2">
                                <AlertDialogCancel className="flex-1 rounded-xl h-11 bg-white/5 border-white/10 text-white">
                                    Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleResetHistory}
                                    className="flex-1 rounded-xl h-11 bg-red-600 hover:bg-red-500 text-white font-bold"
                                >
                                    Làm mới
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto mobile-scroll relative z-10">
                {!hasPlayers ? (
                    /* Empty Players State */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                            <UserPlus size={32} />
                        </div>
                        <div className="flex flex-col gap-1 max-w-[260px]">
                            <h2 className="text-base font-bold text-white">
                                Chưa có người chơi
                            </h2>
                            <p className="text-xs text-gray-400">
                                Hãy thêm tối đa 4 người chơi để bắt đầu ghi điểm
                                từng ván.
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsAddPlayerOpen(true)}
                            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-600/25"
                        >
                            <UserPlus size={16} className="mr-2" />
                            Thêm người chơi ngay
                        </Button>
                    </div>
                ) : (
                    /* Active Game View */
                    <div className="flex flex-col flex-1">
                        {/* Interactive Player Scoreboard Podium (Sticky) */}
                        <div className="sticky top-0 z-10 bg-[#0B0F19]/95 backdrop-blur-md border-b border-white/[0.08] px-3 py-2.5 shadow-md shadow-black/20">
                            <div className="flex items-center">
                                {/* Left round number spacer */}
                                <div className="w-8 shrink-0 text-center text-[10px] font-bold text-gray-500 uppercase">
                                    #
                                </div>
                                <div
                                    className={`flex-1 grid gap-2 ${
                                        players.length === 2
                                            ? "grid-cols-2"
                                            : players.length === 3
                                              ? "grid-cols-3"
                                              : "grid-cols-4"
                                    }`}
                                >
                                    {players.map((player) => {
                                        return (
                                            <div
                                                key={player.id}
                                                className="bg-[#141824] border border-white/[0.08] rounded-2xl py-3 px-1 flex flex-col items-center justify-center shadow-sm"
                                            >
                                                <span className="text-[13px] font-bold text-gray-200 uppercase tracking-tight truncate max-w-full px-1">
                                                    {player.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Round History Rows */}
                        <div className="flex-1 flex flex-col p-2 gap-1.5">
                            {history.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-gray-500 text-xs gap-2">
                                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                        🃏
                                    </span>
                                    Chưa có ván nào được ghi.
                                    <span className="text-gray-400 font-semibold">
                                        Nhấn "GHI ĐIỂM" bên dưới để bắt đầu!
                                    </span>
                                </div>
                            ) : (
                                [...history]
                                    .map((round, originalIdx) => ({
                                        round,
                                        roundNumber: originalIdx + 1,
                                    }))
                                    .reverse()
                                    .map(({ round, roundNumber }) => (
                                        <div
                                            key={roundNumber}
                                            onClick={() => {
                                                setEditingRoundIndex(
                                                    roundNumber - 1,
                                                );
                                                setIsScoreDrawerOpen(true);
                                            }}
                                            className="flex items-center py-2.5 px-1 rounded-2xl bg-[#0f1422]/60 hover:bg-[#141a2e] border border-white/[0.04] active:scale-[0.99] transition-all cursor-pointer group"
                                        >
                                            <div className="w-8 shrink-0 flex flex-col items-center justify-center">
                                                <span className="text-[11px] font-mono font-bold text-gray-400">
                                                    V{roundNumber}
                                                </span>
                                            </div>

                                            <div
                                                className={`flex-1 grid gap-2 ${
                                                    players.length === 2
                                                        ? "grid-cols-2"
                                                        : players.length === 3
                                                          ? "grid-cols-3"
                                                          : "grid-cols-4"
                                                }`}
                                            >
                                                {players.map((player) => {
                                                    const roundScores =
                                                        round.scores || round;
                                                    const score =
                                                        roundScores[
                                                            player.id
                                                        ] ??
                                                        roundScores[
                                                            player.name
                                                        ] ??
                                                        0;
                                                    return (
                                                        <div
                                                            key={player.id}
                                                            className="flex flex-col items-center justify-center"
                                                        >
                                                            <span
                                                                className={`text-[14px] font-bold font-mono ${
                                                                    score > 0
                                                                        ? "text-emerald-400 font-black"
                                                                        : score <
                                                                            0
                                                                          ? "text-rose-400 font-black"
                                                                          : "text-gray-400"
                                                                }`}
                                                            >
                                                                {score > 0
                                                                    ? `+${score}`
                                                                    : score}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Fixed Action Zone (Thumb ergonomics) */}
            <div
                className="p-3 bg-[#0B0F19]/95 backdrop-blur-md border-t border-white/[0.08] shrink-0 z-20"
                style={{ paddingBottom: `calc(0.75rem + ${bottomOffset}px)` }}
            >
                {!hasPlayers ? (
                    <Button
                        onClick={() => setIsAddPlayerOpen(true)}
                        className="w-full h-13 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-base shadow-lg shadow-red-600/25 active:scale-[0.98] transition-all"
                    >
                        <UserPlus size={18} className="mr-2" />
                        THÊM NGƯỜI CHƠI ĐỂ GHI ĐIỂM
                    </Button>
                ) : (
                    <Drawer
                        open={isScoreDrawerOpen}
                        onOpenChange={setIsScoreDrawerOpen}
                    >
                        <DrawerTrigger asChild>
                            <Button
                                onClick={() => {
                                    setEditingRoundIndex(null);
                                    setIsScoreDrawerOpen(true);
                                }}
                                className="w-full h-13 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-base tracking-wider shadow-[0_4px_25px_rgba(239,68,68,0.3)] border border-red-400/20 active:scale-[0.98] transition-all"
                            >
                                <Plus
                                    size={20}
                                    className="mr-1.5"
                                    strokeWidth={3}
                                />
                                GHI ĐIỂM VÁN {roundCount + 1}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-[#0c101b] border-white/10 outline-none overflow-hidden p-0 max-h-[90vh]">
                            <ScoreDrawer
                                key={
                                    editingRoundIndex === null
                                        ? "new"
                                        : `edit-${editingRoundIndex}`
                                }
                                players={players}
                                initialData={
                                    editingRoundIndex !== null
                                        ? history[editingRoundIndex]?.details
                                        : undefined
                                }
                                roundNumber={
                                    editingRoundIndex !== null
                                        ? editingRoundIndex + 1
                                        : roundCount + 1
                                }
                                onConfirm={handleConfirmScore}
                                onDelete={handleDeleteRound}
                            />
                        </DrawerContent>
                    </Drawer>
                )}
            </div>

            {/* Leaderboard Report Modal */}
            <Drawer open={isReportOpen} onOpenChange={setIsReportOpen}>
                <DrawerContent className="bg-[#0c101b] border-white/10 outline-none overflow-hidden p-0 max-h-[85vh]">
                    <div className="flex flex-col h-full text-white font-sans">
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto my-2 shrink-0" />

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] shrink-0 bg-[#0f1422]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                                    <Trophy size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-white">
                                        Báo Cáo Tổng Kết Bàn
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                        Tổng {roundCount} ván đấu đã qua
                                    </span>
                                </div>
                            </div>
                            <DrawerClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full bg-white/5 text-gray-400 hover:text-white"
                                >
                                    <X size={18} />
                                </Button>
                            </DrawerClose>
                        </div>

                        {/* Rankings List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 mobile-scroll">
                            {players
                                .map((player) => {
                                    const total = getPlayerTotal(player.id);
                                    return { player, total };
                                })
                                .sort((a, b) => b.total - a.total)
                                .map(({ player, total }, idx) => {
                                    const isWinner = idx === 0 && total > 0;
                                    const isLoser =
                                        idx === players.length - 1 && total < 0;
                                    return (
                                        <div
                                            key={player.id}
                                            className={`rounded-2xl p-3.5 flex items-center justify-between border ${
                                                isWinner
                                                    ? "bg-gradient-to-r from-amber-500/15 via-[#141824] to-[#141824] border-amber-500/30"
                                                    : "bg-[#141824] border-white/5"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                                                        idx === 0
                                                            ? "bg-amber-500 text-black font-black"
                                                            : idx === 1
                                                              ? "bg-slate-300 text-black font-black"
                                                              : idx === 2
                                                                ? "bg-amber-700 text-white font-black"
                                                                : "bg-white/10 text-gray-400"
                                                    }`}
                                                >
                                                    {idx + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                                                        {player.name}
                                                        {isWinner && (
                                                            <span>👑</span>
                                                        )}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400">
                                                        {isWinner
                                                            ? "Đang thắng lớn"
                                                            : isLoser
                                                              ? "Đang xếp chót"
                                                              : "Thứ hạng " +
                                                                (idx + 1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-lg font-black font-mono ${
                                                    total > 0
                                                        ? "text-emerald-400"
                                                        : total < 0
                                                          ? "text-rose-400"
                                                          : "text-gray-400"
                                                }`}
                                            >
                                                {total > 0
                                                    ? `+${total}`
                                                    : total}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-white/[0.08] shrink-0 bg-[#0f1422]">
                            <DrawerClose asChild>
                                <Button className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold">
                                    Đóng báo cáo
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
