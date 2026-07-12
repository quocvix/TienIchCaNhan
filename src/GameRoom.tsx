import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus, Plus, RotateCcw, Flag, X } from "lucide-react";
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

export default function GameRoom() {
    const navigate = useNavigate();

    const query = new URLSearchParams(window.location.search);
    const gameId = query.get("id");

    const [players, setPlayers] = useState<string[]>(() => {
        if (!gameId) return [];
        const stored = localStorage.getItem("game_history");
        if (stored) {
            const games = JSON.parse(stored);
            const found = games.find((g: any) => g.id === gameId);
            if (found) return found.players;
        }
        return [];
    });

    const [history, setHistory] = useState<any[]>(() => {
        if (!gameId) return [];
        const stored = localStorage.getItem("game_history");
        if (stored) {
            const games = JSON.parse(stored);
            const found = games.find((g: any) => g.id === gameId);
            if (found) return found.history;
        }
        return [];
    });

    const [editingRoundIndex, setEditingRoundIndex] = useState<number | null>(
        null,
    );
    const [isScoreDrawerOpen, setIsScoreDrawerOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    const [time] = useState(() => {
        if (!gameId) return "09/07 17:33";
        const stored = localStorage.getItem("game_history");
        if (stored) {
            const games = JSON.parse(stored);
            const found = games.find((g: any) => g.id === gameId);
            if (found) return found.time;
        }
        return "09/07 17:33";
    });

    useEffect(() => {
        if (!gameId) return;
        const stored = localStorage.getItem("game_history");
        if (stored) {
            const games = JSON.parse(stored);
            const updated = games.map((g: any) => {
                if (g.id === gameId) {
                    return { ...g, players, history };
                }
                return g;
            });
            localStorage.setItem("game_history", JSON.stringify(updated));
        }
    }, [players, history, gameId]);

    const hasPlayers = players.length > 0;
    const roundCount = history.length;

    const handleConfirmPlayers = (newPlayers: string[]) => {
        const activePlayers = newPlayers.filter((p) => p.trim() !== "");
        setPlayers(activePlayers);
        setHistory([]);

        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                const games = JSON.parse(stored);
                const updated = games.map((g: any) => {
                    if (g.id === gameId) {
                        return { ...g, players: activePlayers, history: [] };
                    }
                    return g;
                });
                localStorage.setItem("game_history", JSON.stringify(updated));
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
                const games = JSON.parse(stored);
                const found = games.find((g: any) => g.id === gameId);
                if (found) {
                    latestHistory = found.history;
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
                const games = JSON.parse(stored);
                const updated = games.map((g: any) => {
                    if (g.id === gameId) {
                        return { ...g, history: newHistory };
                    }
                    return g;
                });
                localStorage.setItem("game_history", JSON.stringify(updated));
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
                const games = JSON.parse(stored);
                const updated = games.map((g: any) => {
                    if (g.id === gameId) {
                        return { ...g, history: newHistory };
                    }
                    return g;
                });
                localStorage.setItem("game_history", JSON.stringify(updated));
            }
        }
    };

    const handleResetHistory = () => {
        setHistory([]);
        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                const games = JSON.parse(stored);
                const updated = games.map((g: any) => {
                    if (g.id === gameId) {
                        return { ...g, history: [] };
                    }
                    return g;
                });
                localStorage.setItem("game_history", JSON.stringify(updated));
            }
        }
    };

    const getPlayerTotal = (name: string) => {
        return history.reduce((sum, round) => {
            const roundScores = round.scores || round;
            return sum + (roundScores[name] || 0);
        }, 0);
    };

    return (
        <div className="min-h-screen w-full relative bg-black text-white font-sans sm:hidden flex flex-col overflow-x-hidden">
            {/* Blue Spotlight Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(
                            circle at center,
                            rgba(59, 130, 246, 0.12) 0%,
                            rgba(59, 130, 246, 0.06) 20%,
                            rgba(0, 0, 0, 0.0) 60%
                        )
                    `,
                }}
            />
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#0f0f12]/60 backdrop-blur-md relative z-10 border-b border-white/5">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white"
                >
                    <ArrowLeft size={20} />
                </Button>

                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-white">{time}</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                        Tổng {roundCount} ván
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-orange-950/40 text-orange-500 hover:bg-orange-950/40 hover:text-orange-500"
                            >
                                <Flag size={18} className="size-[18px]" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            size="sm"
                            className="bg-[#0a0a0a] border-white/5 text-white max-w-[90vw] rounded-2xl"
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-bold text-white text-center">
                                    Xem báo cáo tổng kết?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-gray-400 text-center">
                                    Xác nhận hiển thị bảng báo cáo điểm số chi
                                    tiết của tất cả người chơi.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-3 mt-4">
                                <AlertDialogCancel className="flex-1 h-11 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-white">
                                    Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => setIsReportOpen(true)}
                                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 border-0"
                                >
                                    Xem
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white"
                            >
                                <RotateCcw size={18} className="size-[18px]" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            size="sm"
                            className="bg-[#0a0a0a] border-white/5 text-white max-w-[90vw] rounded-2xl"
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-bold text-white text-center">
                                    Làm mới ván chơi?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-gray-400 text-center">
                                    Hành động này sẽ xóa toàn bộ lịch sử điểm số
                                    của ván đấu hiện tại và không thể hoàn tác.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-3 mt-4">
                                <AlertDialogCancel className="flex-1 h-11 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-white">
                                    Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleResetHistory}
                                    className="flex-1 h-11 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 border-0"
                                >
                                    Làm mới
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto relative z-10">
                {!hasPlayers ? (
                    // Empty State
                    <div className="border border-dashed border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-white/[0.02] to-transparent mt-4">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h2 className="text-lg font-bold text-white">
                                Chưa có người chơi nào.
                            </h2>
                            <p className="text-sm text-gray-400">
                                Thêm người chơi để bắt đầu
                            </p>
                        </div>

                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-2xl h-12 px-6 shadow-lg shadow-red-600/20 font-bold">
                                    <UserPlus
                                        size={18}
                                        className="mr-2"
                                        strokeWidth={2.5}
                                    />
                                    Thêm người chơi
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="bg-[#0a0a0a] border-white/5 outline-none overflow-hidden p-0 h-[95vh] data-[vaul-drawer-direction=bottom]:max-h-[95vh]">
                                <AddPlayerDrawer
                                    onConfirm={handleConfirmPlayers}
                                />
                            </DrawerContent>
                        </Drawer>
                    </div>
                ) : (
                    // Active Game State
                    <div className="flex flex-col">
                        {/* Player Totals */}
                        <div className="p-3 border-b border-white/5">
                            <div className="flex items-center">
                                <div className="w-8 shrink-0" />
                                <div
                                    className={`flex-1  grid gap-3 ${players.length === 2 ? "grid-cols-2" : players.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}
                                >
                                    {players.map((name, idx) => {
                                        return (
                                            <div
                                                key={idx}
                                                className="bg-[#151517] border rounded-xl flex flex-col items-center justify-center py-3 gap-2 shadow-sm"
                                            >
                                                <span className="text-[16px] font-bold text-gray-200 uppercase tracking-widest truncate max-w-full px-1">
                                                    {name}
                                                </span>
                                                {/* <span
                                                    className={`text-[16px] font-black ${total > 0 ? "text-emerald-500" : total < 0 ? "text-[#ff3333]" : "text-gray-400"}`}
                                                >
                                                    {total > 0
                                                        ? `+${total}`
                                                        : total}
                                                </span> */}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* History */}
                        <div className="flex flex-col gap-2 px-1 pt-2">
                            {[...history]
                                .map((round, originalIdx) => ({
                                    round,
                                    roundNumber: originalIdx + 1,
                                }))
                                .reverse()
                                .map(({ round, roundNumber }, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setEditingRoundIndex(
                                                roundNumber - 1,
                                            );
                                            setIsScoreDrawerOpen(true);
                                        }}
                                        className="flex items-center py-3 border-b border-white/5 active:bg-white/[0.02] transition-colors cursor-pointer"
                                    >
                                        <span className="w-8 pl-2 text-sm font-bold text-gray-500">
                                            {roundNumber}
                                        </span>
                                        <div
                                            className={`flex-1 grid gap-2 ${players.length === 2 ? "grid-cols-2" : players.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}
                                        >
                                            {players.map((name, sIdx) => {
                                                const roundScores =
                                                    round.scores || round;
                                                const score =
                                                    roundScores[name] || 0;
                                                return (
                                                    <div
                                                        key={sIdx}
                                                        className="flex justify-center"
                                                    >
                                                        <span
                                                            className={`text-[16px] font-bold ${score > 0 ? "text-emerald-500" : score < 0 ? "text-[#ff3333]" : "text-gray-400"}`}
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
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Action */}
            <div className="p-4 bg-[#0a0a0a]/60 backdrop-blur-md border-t border-white/5 shrink-0 mt-auto relative z-10">
                {!hasPlayers ? (
                    <Button
                        className="w-full h-14 rounded-2xl bg-[#591c20] hover:bg-[#6e2227] text-gray-300 font-bold text-lg tracking-wider opacity-60 cursor-not-allowed"
                        disabled
                    >
                        <Plus size={20} className="mr-2" strokeWidth={3} />
                        GHI ĐIỂM
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
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-lg tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.25)]"
                            >
                                <Plus
                                    size={24}
                                    className="mr-2"
                                    strokeWidth={2.5}
                                />
                                GHI ĐIỂM
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-[#0a0a0a] border-white/5 outline-none overflow-hidden p-0 h-[95vh] data-[vaul-drawer-direction=bottom]:max-h-[95vh]">
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
                                        : undefined
                                }
                                onConfirm={handleConfirmScore}
                                onDelete={handleDeleteRound}
                            />
                        </DrawerContent>
                    </Drawer>
                )}
            </div>

            <Drawer open={isReportOpen} onOpenChange={setIsReportOpen}>
                <DrawerContent className="bg-[#0a0a0a] border-white/5 outline-none overflow-hidden p-0 h-[80vh] data-[vaul-drawer-direction=bottom]:max-h-[80vh]">
                    <div className="flex flex-col h-full text-white font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0 bg-[#0f0f12]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-950/40 flex items-center justify-center text-orange-500">
                                    <Flag size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold leading-tight text-white">
                                        Báo cáo tổng kết
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium">
                                        Tổng số ván đã đấu: {roundCount}
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
                            {/* Player Rankings List */}
                            <div className="space-y-3">
                                {players
                                    .map((name) => {
                                        const total = getPlayerTotal(name);
                                        return { name, total };
                                    })
                                    .sort((a, b) => b.total - a.total)
                                    .map((player, idx) => {
                                        const isWinner =
                                            idx === 0 && player.total > 0;
                                        const isLoser =
                                            idx === players.length - 1 &&
                                            player.total < 0;
                                        return (
                                            <div
                                                key={idx}
                                                className="bg-[#151517] border border-white/5 rounded-2xl p-4 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                                            isWinner
                                                                ? "bg-emerald-500/20 text-emerald-400"
                                                                : isLoser
                                                                  ? "bg-rose-500/20 text-rose-400"
                                                                  : "bg-white/5 text-gray-400"
                                                        }`}
                                                    >
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-bold text-white uppercase">
                                                            {player.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {isWinner
                                                                ? "👑 Người dẫn đầu"
                                                                : isLoser
                                                                  ? ""
                                                                  : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-lg font-black ${
                                                        player.total > 0
                                                            ? "text-emerald-500"
                                                            : player.total < 0
                                                              ? "text-rose-500"
                                                              : "text-gray-400"
                                                    }`}
                                                >
                                                    {player.total > 0
                                                        ? `${player.total}`
                                                        : player.total}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 shrink-0 bg-[#0f0f12]">
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
