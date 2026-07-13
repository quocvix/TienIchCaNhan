import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Spade, Trash2 } from "lucide-react";
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

interface GameSession {
    id: string;
    time: string;
    players: string[];
    history: Record<string, number>[];
}

export default function Home() {
    const navigate = useNavigate();
    const [games, setGames] = useState<GameSession[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("game_history");
        if (stored) {
            setGames(JSON.parse(stored));
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

    return (
        <div className="min-h-screen w-full relative bg-black text-white font-sans sm:hidden p-4 flex flex-col gap-6 overflow-x-hidden">
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
            <div className="flex items-center justify-between pt-4">
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
                    Ghi Điểm Đánh Bài
                </h1>
                {/* <Button
                    variant="ghost"
                    size="icon"
                    className="bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white rounded-2xl h-12 w-12 flex items-center justify-center"
                >
                    <Settings size={24} />
                </Button> */}
            </div>

            {/* Main Action Card */}
            <Drawer>
                <DrawerTrigger asChild>
                    <div className="mt-4 relative bg-[#d60000] rounded-[2rem] p-6 flex items-center justify-between cursor-pointer overflow-hidden shadow-[0_4px_30px_rgba(214,0,0,0.3)] active:scale-95 transition-transform">
                        <div className="relative z-10 w-[88px] h-[88px] bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={pokerIcon}
                                alt="playing-cards"
                            />
                        </div>
                        <div className="relative z-10 flex items-center gap-1 pr-2">
                            <span className="text-[32px] font-bold text-white tracking-tight leading-none">
                                Tạo Ván Mới
                            </span>
                            <Plus
                                size={36}
                                className="text-white"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                </DrawerTrigger>
                <DrawerContent className="bg-[#0a0a0a] border-white/5 outline-none overflow-hidden p-0 max-h-[90vh]">
                    <CreateGameDrawer />
                </DrawerContent>
            </Drawer>

            {/* History List */}
            <div className="flex flex-col gap-4 mt-6">
                {games.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-white/10 rounded-[2rem] bg-gradient-to-b from-white/[0.01] to-transparent gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#2a1114] flex items-center justify-center text-[#ff3333] shadow-[0_0_20px_rgba(255,51,51,0.1)]">
                            <Spade size={28} />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="text-base font-bold text-white">
                                Chưa có bàn chơi nào.
                            </span>
                            <span className="text-sm text-gray-500 font-medium">
                                Hãy tạo bàn mới!
                            </span>
                        </div>
                    </div>
                ) : (
                    games.map((item) => {
                        const roundCount = item.history.length;
                        const playerScores = item.players.map((name) => {
                            const score = item.history.reduce(
                                (sum, round) => sum + (round[name] || 0),
                                0,
                            );
                            return { name, score };
                        });

                        return (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/room?id=${item.id}`)}
                                className="bg-[#161618] rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
                            >
                                {/* Left red accent line */}
                                <div className="absolute left-0 top-6 bottom-6 w-1 bg-red-500 rounded-r-full" />

                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-5 pl-2">
                                        <div className="w-[52px] h-[52px] rounded-2xl bg-[#2a1114] flex items-center justify-center text-[#ff3333]">
                                            <Spade size={28} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center">
                                                <span className="text-[10px] font-bold tracking-wider bg-[#2a1114] text-[#ff3333] px-2.5 py-1 rounded-md uppercase">
                                                    Tiến Lên
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-gray-400 font-semibold tracking-wide">
                                                {item.players.length} NGƯỜI •
                                                VÁN {roundCount}
                                            </div>
                                            <div className="text-[20px] font-bold text-white leading-none mt-0.5">
                                                {item.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action button: Delete */}
                                    <div
                                        className="relative z-20"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    className="text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl h-12 w-12 flex items-center justify-center mr-2"
                                                >
                                                    <Trash2 size={24} className="size-6" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent
                                                size="sm"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <AlertDialogHeader>
                                                    <AlertDialogMedia className="bg-[#ff3333]/10 text-[#ff3333]">
                                                        <Trash2 size={20} />
                                                    </AlertDialogMedia>
                                                    <AlertDialogTitle>
                                                        Xóa ván chơi?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Hành động này sẽ xóa
                                                        vĩnh viễn ván chơi này
                                                        và không thể hoàn tác.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        variant="outline"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        variant="destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteGame(
                                                                item.id,
                                                            );
                                                        }}
                                                    >
                                                        Xóa
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                {/* Players List */}
                                {playerScores.length > 0 && (
                                    <div className="border-t border-white/5 pt-3 flex flex-col gap-2.5 pl-2 pr-2">
                                        {playerScores.map((player, pIdx) => (
                                            <div
                                                key={pIdx}
                                                className="flex items-center justify-between"
                                            >
                                                <span className="text-sm font-semibold text-gray-300">
                                                    {player.name}
                                                </span>
                                                <span
                                                    className={`text-xs font-bold px-2 py-0.5 rounded-lg border font-mono ${
                                                        player.score > 0
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                                                            : player.score < 0
                                                              ? "bg-[#ff3333]/10 text-[#ff3333] border-[#ff3333]/10"
                                                              : "bg-gray-500/10 text-gray-400 border-gray-500/10"
                                                    }`}
                                                >
                                                    {player.score > 0
                                                        ? `+${player.score}`
                                                        : player.score}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
