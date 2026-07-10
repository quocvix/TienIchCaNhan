import { ArrowLeft, Undo2, Settings, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function GameRoom() {
    const navigate = useNavigate();

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
                        09/07 17:40
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                        Tổng 0 ván
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
            <div className="flex-1 p-4 mt-6">
                <div className="border border-dashed border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h2 className="text-lg font-bold text-white">
                            Chưa có người chơi nào.
                        </h2>
                        <p className="text-sm text-gray-400">
                            Thêm người chơi để bắt đầu
                        </p>
                    </div>

                    <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-2xl h-12 px-6 shadow-lg shadow-red-600/20 font-bold">
                        <UserPlus size={18} className="mr-2" strokeWidth={2.5} />
                        Thêm người chơi
                    </Button>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/5 shrink-0 mt-auto">
                <Button 
                    className="w-full h-14 rounded-2xl bg-[#591c20] hover:bg-[#6e2227] text-gray-300 font-bold text-lg tracking-wider"
                >
                    <Plus size={20} className="mr-2" strokeWidth={3} />
                    GHI ĐIỂM
                </Button>
            </div>
        </div>
    );
}
