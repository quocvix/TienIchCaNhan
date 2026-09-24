import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Spade, Trash2, ChevronRight, History, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CreateGameDrawer from "./CreateGameDrawer.tsx";
import pokerIcon from "./assets/icons8-poker-94.png";

import type { Player } from "@/types";

interface GameSession {
    id: string;
    time: string;
    players: Player[];
    history: any[];
}

export default function Home() {
    const navigate = useNavigate();
    const [games, setGames] = useState<GameSession[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("game_history");
        if (stored) {
            try {
                const rawGames = JSON.parse(stored);
                const normalized = rawGames.map((g: any) => ({
                    ...g,
                    players: (g.players || []).map((p: any) =>
                        typeof p === "string" ? { id: p, name: p } : p
                    ),
                }));
                setGames(normalized);
            } catch (e) {
                console.error("Error reading game history", e);
                setGames([]);
            }
        } else {
            localStorage.setItem("game_history", JSON.stringify([]));
            setGames([]);
        }
    }, []);

    const handleDeleteGame = (id: string) => {
        const updated = games.filter((g) => g.id !== id);
        setGames(updated);
        localStorage.setItem("game_history", JSON.stringify(updated));
    };

    const [revealedGames, setRevealedGames] = useState<Record<string, boolean>>({});

    const toggleRevealGame = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setRevealedGames((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="flex-1 w-full flex flex-col min-h-0 bg-[#07090E] text-white font-sans overflow-y-auto mobile-scroll relative">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[280px] pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(
                            circle at 50% 10%,
                            rgba(239, 68, 68, 0.12) 0%,
                            rgba(99, 102, 241, 0.06) 50%,
                            transparent 80%
                        )
                    `,
                }}
            />

            <div className="relative z-10 flex flex-col p-4 gap-5 pb-8">
                {/* App Brand Header */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                            <Spade size={20} className="fill-white stroke-none" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black tracking-tight text-white leading-tight flex items-center gap-1.5">
                                TIẾN LÊN PRO
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                                    APP
                                </span>
                            </h1>
                            <p className="text-[11px] font-semibold text-gray-400">
                                Ghi điểm & quản lý ván bài
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#141824] px-3 py-1.5 rounded-full border border-white/5">
                        <History size={13} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-300 font-mono">
                            {games.length} bàn
                        </span>
                    </div>
                </div>

                {/* Primary Action Card: Tạo Bàn Mới */}
                <Drawer>
                    <DrawerTrigger asChild>
                        <div className="relative group cursor-pointer active:scale-[0.98] transition-all duration-150">
                            <div className="relative bg-gradient-to-br from-[#d60000] via-[#c20000] to-[#8b0000] rounded-[26px] p-5 flex items-center justify-between overflow-hidden shadow-[0_8px_30px_rgba(214,0,0,0.35)] border border-red-400/20">
                                {/* Subtle Light Reflection overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/95 p-2 flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
                                        <img
                                            className="w-full h-full object-contain"
                                            src={pokerIcon}
                                            alt="playing-cards"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-white tracking-tight leading-tight">
                                            Tạo Ván Mới
                                        </span>
                                        <span className="text-xs font-medium text-red-100/80 mt-0.5">
                                            Chọn luật & thiết lập người chơi
                                        </span>
                                    </div>
                                </div>

                                <div className="relative z-10 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0 shadow-inner">
                                    <Plus size={24} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-[#0c101b] border-white/10 outline-none overflow-hidden p-0 max-h-[90vh]">
                        <CreateGameDrawer />
                    </DrawerContent>
                </Drawer>

                {/* Game History Section */}
                <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-gray-400" />
                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Lịch sử các bàn chơi
                            </h2>
                        </div>
                        {games.length > 0 && (
                            <span className="text-[11px] text-gray-500 font-medium">
                                Chạm để tiếp tục
                            </span>
                        )}
                    </div>

                    {games.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-14 px-6 border border-dashed border-white/10 rounded-[28px] bg-gradient-to-b from-white/[0.02] to-transparent gap-4 text-center mt-2">
                            <div className="w-16 h-16 rounded-2xl bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                                <Spade size={32} />
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <h3 className="text-base font-bold text-white">
                                    Chưa có bàn chơi nào
                                </h3>
                                <p className="text-xs text-gray-400 max-w-[220px] leading-relaxed">
                                    Nhấn <span className="text-red-400 font-semibold">Tạo Ván Mới</span> để bắt đầu tính điểm cùng bạn bè ngay!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {games.map((item) => {
                                const roundCount = item.history?.length || 0;
                                const playerScores = (item.players || []).map((player) => {
                                    const score = (item.history || []).reduce(
                                        (sum: number, round: any) => {
                                            const roundScores = round.scores || round;
                                            return (
                                                sum +
                                                (roundScores[player.id] ??
                                                    roundScores[player.name] ??
                                                    0)
                                            );
                                        },
                                        0
                                    );
                                    return { player, score };
                                });

                                // Find highest score leader
                                const topScorer = playerScores.length > 0 && roundCount > 0
                                    ? [...playerScores].sort((a, b) => b.score - a.score)[0]
                                    : null;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/room?id=${item.id}`)}
                                        className="bg-[#111624] hover:bg-[#161c2e] border border-white/[0.07] rounded-3xl p-4 flex flex-col gap-3.5 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all shadow-md shadow-black/30 group"
                                    >
                                        {/* Left accent pill */}
                                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-r-full" />

                                        {/* Card Top Row */}
                                        <div className="flex items-center justify-between w-full pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                                                    <Spade size={22} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-white leading-tight">
                                                            Tiến Lên Miền Nam
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            {roundCount} ván
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] font-mono text-gray-400 mt-0.5">
                                                        {item.time}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Button: Delete Game */}
                                            <div
                                                className="relative z-20 flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl h-10 w-10 flex items-center justify-center"
                                                        >
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent
                                                        size="sm"
                                                        className="bg-[#0f1422] border-white/10 text-white rounded-3xl p-6"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <AlertDialogHeader>
                                                            <AlertDialogMedia className="bg-red-500/10 text-red-500 mx-auto">
                                                                <Trash2 size={24} />
                                                            </AlertDialogMedia>
                                                            <AlertDialogTitle className="text-center text-white text-lg font-bold">
                                                                Xóa bàn chơi?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-center text-gray-400 text-xs">
                                                                Toàn bộ lịch sử điểm số của bàn này sẽ bị xóa vĩnh viễn và không thể khôi phục.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="flex gap-2.5 mt-2">
                                                            <AlertDialogCancel
                                                                variant="outline"
                                                                className="flex-1 rounded-xl h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                Hủy
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                className="flex-1 rounded-xl h-11 bg-red-600 hover:bg-red-500 text-white font-bold"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteGame(item.id);
                                                                }}
                                                            >
                                                                Xóa
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Player Scores Mini Row */}
                                        {playerScores.length > 0 && (() => {
                                            const isRevealed = !!revealedGames[item.id];
                                            return (
                                                <div className="border-t border-white/[0.06] pt-2.5 pl-2 flex items-center justify-between gap-2 flex-wrap">
                                                    <div className="flex items-center gap-1.5 flex-wrap flex-1">
                                                        {playerScores.map(({ player, score }) => {
                                                            const isLeader =
                                                                isRevealed &&
                                                                topScorer &&
                                                                topScorer.player.id === player.id &&
                                                                topScorer.score > 0;
                                                            return (
                                                                <div
                                                                    key={player.id}
                                                                    className="flex items-center gap-1.5 bg-[#0a0d16] px-2.5 py-1 rounded-xl border border-white/5"
                                                                >
                                                                    {isLeader && (
                                                                        <span className="text-[10px]">👑</span>
                                                                    )}
                                                                    <span className="text-[12px] font-bold text-gray-300 max-w-[80px] truncate">
                                                                        {player.name}
                                                                    </span>
                                                                    {isRevealed && (
                                                                        <span
                                                                            className={`text-[11px] font-black font-mono ${
                                                                                score > 0
                                                                                    ? "text-emerald-400"
                                                                                    : score < 0
                                                                                      ? "text-rose-400"
                                                                                      : "text-gray-400"
                                                                            }`}
                                                                        >
                                                                            {score > 0 ? `+${score}` : score}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Reveal Scores Toggle Button */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => toggleRevealGame(item.id, e)}
                                                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-400/25 active:scale-95 transition-all shrink-0"
                                                    >
                                                        {isRevealed ? (
                                                            <>
                                                                <EyeOff size={13} />
                                                                <span>Ẩn điểm</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye size={13} />
                                                                <span>Xem điểm</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
