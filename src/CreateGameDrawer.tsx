import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DrawerClose,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";

export default function CreateGameDrawer() {
    const navigate = useNavigate();

    return (
        <>
            <DrawerHeader className="flex flex-row items-center justify-between p-4 border-b border-white/5 shrink-0 text-left">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1c1c1e] text-red-500 hover:bg-[#2a2a2c] hover:text-red-400"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </Button>
                    <div className="flex flex-col text-left">
                        <DrawerTitle className="text-xl font-bold leading-tight text-white">
                            Tiến Lên
                        </DrawerTitle>
                        <DrawerDescription className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
                            Tạo bàn chơi mới
                        </DrawerDescription>
                    </div>
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
            </DrawerHeader>

            {/* Content */}
            <div className="flex-1 no-scrollbar overflow-y-auto p-4 pb-6">
                {/* Win/Lose Points */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Hệ số / Điểm thắng thua
                    </h2>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: "NHẤT", value: "4" },
                            { label: "NHÌ", value: "3" },
                            { label: "BA", value: "2" },
                            { label: "BÉT", value: "1" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <Label className="justify-center text-center text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                                    {item.label}
                                </Label>
                                <Input
                                    type="text"
                                    defaultValue={item.value}
                                    className="w-full h-auto rounded-xl bg-[#1c1c1e] border-white/5 py-3 text-center text-lg font-bold text-white focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:border-transparent"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Penalty Points */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Phạt thối/chặt (Hệ số/điểm)
                    </h2>
                    <div className="grid grid-cols-3 gap-3 gap-y-4">
                        {[
                            { label: "HEO ĐỎ", value: "4" },
                            { label: "HEO ĐEN", value: "2" },
                            { label: "CHẶT HEO ĐỎ", value: "4" },
                            { label: "CHẶT HEO ĐEN", value: "2" },
                            { label: "CHẾT HEO ĐỎ", value: "2" },
                            { label: "CHẾT HEO ĐEN", value: "1" },
                            { label: "CHẾT CHÁY", value: "4" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <Label className="text-left text-[10px] font-bold tracking-wider text-gray-500 uppercase ml-1">
                                    {item.label}
                                </Label>
                                <Input
                                    type="text"
                                    defaultValue={item.value}
                                    className="w-full h-auto rounded-xl bg-[#1c1c1e] border-white/5 py-3 px-4 text-left text-lg font-bold text-white focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:border-transparent"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <DrawerFooter className="p-4 border-t border-white/5 shrink-0 bg-[#0a0a0a]">
                <div className="grid grid-cols-2 gap-3 mx-auto w-full">
                    <DrawerClose asChild>
                        <Button
                            variant="secondary"
                            className="h-auto rounded-xl bg-[#2a2a2a] py-4 text-sm font-bold text-white hover:bg-[#3a3a3a]"
                        >
                            Hủy
                        </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Button
                            onClick={() => navigate("/room")}
                            className="h-auto rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:from-red-500 hover:to-red-400 hover:text-white"
                        >
                            Tạo bàn
                        </Button>
                    </DrawerClose>
                </div>
            </DrawerFooter>
        </>
    );
}
