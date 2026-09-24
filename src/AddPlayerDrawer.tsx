import { useState } from "react";
import { X, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DrawerClose,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import type { Player } from "@/types";

interface AddPlayerDrawerProps {
    initialPlayers?: Player[];
    onConfirm: (players: Player[]) => void;
}

const playerAvatars = [
    { label: "1", bg: "bg-red-500/20 text-red-400 border-red-500/30" },
    { label: "2", bg: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { label: "3", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    { label: "4", bg: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
];

export default function AddPlayerDrawer({ 
    initialPlayers = [], 
    onConfirm 
}: AddPlayerDrawerProps) {
    const [playerInputs, setPlayerInputs] = useState<{ id: string; name: string }[]>(() =>
        [0, 1, 2, 3].map((idx) => ({
            id: initialPlayers[idx]?.id || "",
            name: initialPlayers[idx]?.name || "",
        }))
    );

    const handleNameChange = (index: number, value: string) => {
        const updated = [...playerInputs];
        updated[index] = { ...updated[index], name: value };
        setPlayerInputs(updated);
    };

    const handleQuickFill = () => {
        const presets = ["Bắc", "Trung", "Nam", "Tây"];
        setPlayerInputs(
            presets.map((name, idx) => ({
                id: playerInputs[idx]?.id || crypto.randomUUID(),
                name,
            }))
        );
    };

    const handleConfirm = () => {
        const confirmed: Player[] = playerInputs
            .filter((p) => p.name.trim() !== "")
            .map((p) => ({
                id: p.id || crypto.randomUUID(),
                name: p.name.trim(),
            }));
        onConfirm(confirmed);
    };

    return (
        <div className="flex flex-col h-full bg-[#0c101b] text-white font-sans">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto my-2 shrink-0" />

            {/* Header */}
            <DrawerHeader className="flex flex-row items-center justify-between p-4 border-b border-white/[0.08] shrink-0 text-left bg-[#0f1422]">
                <div className="flex flex-col text-left">
                    <DrawerTitle className="text-lg font-bold leading-tight text-white flex items-center gap-2">
                        <span>Danh Sách Người Chơi</span>
                    </DrawerTitle>
                    <DrawerDescription className="text-[11px] text-gray-400">
                        Nhập tên từ 2 đến 4 người chơi trong ván bài
                    </DrawerDescription>
                </div>
                <DrawerClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    >
                        <X size={18} />
                    </Button>
                </DrawerClose>
            </DrawerHeader>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 mobile-scroll">
                {/* Quick fill preset button */}
                <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Người chơi (Tối đa 4)
                    </span>
                    <button
                        type="button"
                        onClick={handleQuickFill}
                        className="text-[11px] font-bold text-amber-400 flex items-center gap-1 active:opacity-75 transition-opacity"
                    >
                        <Sparkles size={12} />
                        Điền nhanh mẫu (Bắc, Trung, Nam, Tây)
                    </button>
                </div>

                <div className="flex flex-col gap-2.5">
                    {[0, 1, 2, 3].map((idx) => {
                        const avatar = playerAvatars[idx];
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3 bg-[#141824] border border-white/[0.08] rounded-2xl p-2.5 pr-3 focus-within:border-red-500/50 transition-colors"
                            >
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${avatar.bg}`}
                                >
                                    {playerInputs[idx].name ? playerInputs[idx].name.charAt(0).toUpperCase() : avatar.label}
                                </div>

                                <Input
                                    type="text"
                                    placeholder={`Tên người chơi ${idx + 1}`}
                                    value={playerInputs[idx].name}
                                    onChange={(e) => handleNameChange(idx, e.target.value)}
                                    className="flex-1 h-9 bg-transparent border-0 text-white font-bold text-sm focus-visible:ring-0 p-0 placeholder:text-gray-500"
                                />

                                {playerInputs[idx].name && (
                                    <button
                                        type="button"
                                        onClick={() => handleNameChange(idx, "")}
                                        className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white shrink-0"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <DrawerFooter className="p-4 border-t border-white/[0.08] shrink-0 bg-[#0f1422]">
                <DrawerClose asChild>
                    <Button 
                        onClick={handleConfirm}
                        className="w-full h-13 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all"
                    >
                        <UserPlus size={16} className="mr-2" />
                        Xác nhận danh sách người chơi
                    </Button>
                </DrawerClose>
            </DrawerFooter>
        </div>
    );
}
