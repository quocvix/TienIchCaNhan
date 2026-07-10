import { useState } from "react";
import { ArrowLeft, Undo2, Settings, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import AddPlayerDrawer from "./AddPlayerDrawer.tsx";
import ScoreDrawer from "./ScoreDrawer.tsx";

export default function GameRoom() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<string[]>([]);
    const [history, setHistory] = useState<Record<string, number>[]>([]);

    const hasPlayers = players.length > 0;
    const roundCount = history.length;

    const handleConfirmPlayers = (newPlayers: string[]) => {
        const activePlayers = newPlayers.filter((p) => p.trim() !== "");
        setPlayers(activePlayers);

        // Pre-populate with 1 mock round to match the screenshot UI
        const mockRound: Record<string, number> = {};
        const mockScores = [3, 2, -1, 3];
        activePlayers.forEach((name, idx) => {
            mockRound[name] =
                mockScores[idx] !== undefined ? mockScores[idx] : 0;
        });
        setHistory([mockRound]);
    };

    const handleConfirmScore = (scores: Record<string, number>) => {
        setHistory([...history, scores]);
    };

    const getPlayerTotal = (name: string) => {
        return history.reduce((sum, round) => sum + (round[name] || 0), 0);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans sm:hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#0f0f12]">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white"
                >
                    <ArrowLeft size={20} />
                </Button>

                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-white">
                        09/07 17:33
                    </span>
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
            <div className="flex-1 p-4 mt-2 overflow-y-auto">
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
                            <DrawerContent className="bg-[#0a0a0a] border-white/5 outline-none overflow-hidden p-0 h-[80vh]">
                                <AddPlayerDrawer
                                    onConfirm={handleConfirmPlayers}
                                />
                            </DrawerContent>
                        </Drawer>
                    </div>
                ) : (
                    // Active Game State
                    <div className="flex flex-col gap-6">
                        {/* Player Totals */}
                        <div
                            className={`grid gap-2 ${players.length === 2 ? "grid-cols-2" : players.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}
                        >
                            {players.map((name, idx) => {
                                const total = getPlayerTotal(name);
                                return (
                                    <div
                                        key={idx}
                                        className="bg-[#151517] rounded-xl flex flex-col items-center justify-center py-4 gap-2 shadow-sm"
                                    >
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            {name}
                                        </span>
                                        <span
                                            className={`text-[22px] font-black ${total > 0 ? "text-emerald-500" : total < 0 ? "text-[#ff3333]" : "text-gray-400"}`}
                                        >
                                            {total > 0 ? `+${total}` : total}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* History */}
                        <div className="flex flex-col gap-3 px-1 mt-4">
                            {history.map((round, roundIdx) => (
                                <div
                                    key={roundIdx}
                                    className="flex items-center"
                                >
                                    <span className="w-8 text-xs font-bold text-gray-500">
                                        {roundIdx + 1}
                                    </span>
                                    <div
                                        className={`flex-1 grid gap-2 ${players.length === 2 ? "grid-cols-2" : players.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}
                                    >
                                        {players.map((name, sIdx) => {
                                            const score = round[name] || 0;
                                            return (
                                                <div
                                                    key={sIdx}
                                                    className="flex justify-center"
                                                >
                                                    <span
                                                        className={`text-[15px] font-bold ${score > 0 ? "text-emerald-500" : score < 0 ? "text-[#ff3333]" : "text-gray-400"}`}
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
            <div className="p-4 bg-[#0a0a0a] border-t border-white/5 shrink-0 mt-auto">
                {!hasPlayers ? (
                    <Button
                        className="w-full h-14 rounded-2xl bg-[#591c20] hover:bg-[#6e2227] text-gray-300 font-bold text-lg tracking-wider opacity-60 cursor-not-allowed"
                        disabled
                    >
                        <Plus size={20} className="mr-2" strokeWidth={3} />
                        GHI ĐIỂM
                    </Button>
                ) : (
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-lg tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.25)]">
                                <Plus
                                    size={24}
                                    className="mr-2"
                                    strokeWidth={2.5}
                                />
                                GHI ĐIỂM
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-[#0a0a0a] border-white/5 outline-none overflow-hidden p-0">
                            <ScoreDrawer
                                players={players}
                                onConfirm={handleConfirmScore}
                            />
                        </DrawerContent>
                    </Drawer>
                )}
            </div>
        </div>
    );
}
