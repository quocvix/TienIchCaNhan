import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DrawerClose } from "@/components/ui/drawer";

interface AddPlayerDrawerProps {
    initialPlayers?: string[];
    onConfirm: (players: string[]) => void;
}

export default function AddPlayerDrawer({ 
    initialPlayers = ["", "", "", ""], 
    onConfirm 
}: AddPlayerDrawerProps) {
    const [players, setPlayers] = useState([...initialPlayers]);

    const handleNameChange = (index: number, value: string) => {
        const newPlayers = [...players];
        newPlayers[index] = value;
        setPlayers(newPlayers);
    };

    return (
        <div className="flex flex-col h-[75vh] bg-[#0a0a0a] text-white font-sans sm:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold leading-tight">
                        Thêm người chơi
                    </h1>
                    <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
                        Tối đa 4 người
                    </span>
                </div>
                <DrawerClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-gray-300"
                    >
                        <X size={20} />
                    </Button>
                </DrawerClose>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-6 space-y-4">
                {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <Label className="text-[10px] font-bold tracking-wider text-gray-500 uppercase ml-1">
                            Người chơi {idx + 1}
                        </Label>
                        <Input
                            type="text"
                            placeholder={`Tên người chơi ${idx + 1}`}
                            value={players[idx]}
                            onChange={(e) => handleNameChange(idx, e.target.value)}
                            className="w-full h-auto rounded-xl bg-[#1c1c1e] border-white/5 py-3 px-4 text-left text-lg font-bold text-white focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-transparent placeholder:text-gray-600"
                        />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 shrink-0 bg-[#0a0a0a]">
                <DrawerClose asChild>
                    <Button 
                        onClick={() => onConfirm(players)}
                        className="w-full h-auto rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:from-red-500 hover:to-red-400 hover:text-white"
                    >
                        Xác nhận
                    </Button>
                </DrawerClose>
            </div>
        </div>
    );
}
