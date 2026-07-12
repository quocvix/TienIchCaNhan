import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Undo2,
    Settings,
    UserPlus,
    Plus,
    X,
    Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerClose,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import AddPlayerDrawer from "./AddPlayerDrawer.tsx";
import ScoreDrawer from "./ScoreDrawer.tsx";

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

    const getGameSettings = () => {
        if (!gameId) return null;
        const stored = localStorage.getItem("game_history");
        if (stored) {
            const games = JSON.parse(stored);
            const found = games.find((g: any) => g.id === gameId);
            if (found && found.settings) return found.settings;
        }
        return null;
    };

    const [time, setTime] = useState(() => {
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
                    className="h-10 w-10 rounded-full bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white"
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white"
                    >
                        <Undo2 size={18} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white"
                    >
                        <Settings size={18} />
                    </Button>
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
                                        const total = getPlayerTotal(name);
                                        return (
                                            <div
                                                key={idx}
                                                className="bg-[#151517] border rounded-xl flex flex-col items-center justify-center py-3 gap-2 shadow-sm"
                                            >
                                                <span className="text-[16px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-full px-1">
                                                    {name}
                                                </span>
                                                <span
                                                    className={`text-[16px] font-black ${total > 0 ? "text-emerald-500" : total < 0 ? "text-[#ff3333]" : "text-gray-400"}`}
                                                >
                                                    {total > 0
                                                        ? `+${total}`
                                                        : total}
                                                </span>
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
                                onConfirm={handleConfirmScore}
                            />
                        </DrawerContent>
                    </Drawer>
                )}
            </div>
        </div>
    );
}
