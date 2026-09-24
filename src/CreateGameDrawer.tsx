import { useState } from "react";
import { X, Spade, Check } from "lucide-react";
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

    const [preset, setPreset] = useState<"standard" | "nhat_an_tat">("standard");

    const [nhat, setNhat] = useState("4");
    const [nhi, setNhi] = useState("3");
    const [ba, setBa] = useState("2");
    const [bet, setBet] = useState("1");

    const [heoDo, setHeoDo] = useState("4");
    const [heoDen, setHeoDen] = useState("2");
    const [chetHeoDo, setChetHeoDo] = useState("4");
    const [chetHeoDen, setChetHeoDen] = useState("2");
    const [chetChay, setChetChay] = useState("4");

    const handleApplyPreset = (type: "standard" | "nhat_an_tat") => {
        setPreset(type);
        if (type === "standard") {
            setNhat("4");
            setNhi("3");
            setBa("2");
            setBet("1");
        } else {
            setNhat("1");
            setNhi("0");
            setBa("0");
            setBet("0");
        }
    };

    const handleCreateGame = () => {
        const id = crypto.randomUUID();
        const now = new Date();
        const time = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const newGame = {
            id,
            time,
            players: [],
            history: [],
            settings: {
                nhat: parseInt(nhat) || 0,
                nhi: parseInt(nhi) || 0,
                ba: parseInt(ba) || 0,
                bet: parseInt(bet) || 0,
                penalties: {
                    heoDo: parseInt(heoDo) || 0,
                    heoDen: parseInt(heoDen) || 0,
                    chetHeoDo: parseInt(chetHeoDo) || 0,
                    chetHeoDen: parseInt(chetHeoDen) || 0,
                    chetChay: parseInt(chetChay) || 0,
                },
            },
        };

        const stored = localStorage.getItem("game_history");
        const games = stored ? JSON.parse(stored) : [];
        games.unshift(newGame);
        localStorage.setItem("game_history", JSON.stringify(games));

        navigate(`/room?id=${id}`);
    };

    return (
        <div className="flex flex-col h-full bg-[#0c101b] text-white font-sans">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto my-2 shrink-0" />

            {/* Header */}
            <DrawerHeader className="flex flex-row items-center justify-between p-4 border-b border-white/[0.08] shrink-0 text-left bg-[#0f1422]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-500">
                        <Spade size={22} />
                    </div>
                    <div className="flex flex-col text-left">
                        <DrawerTitle className="text-lg font-bold leading-tight text-white">
                            Thiết Lập Ván Bài
                        </DrawerTitle>
                        <DrawerDescription className="text-[11px] text-gray-400">
                            Quy định hệ số thắng thua & tiền phạt
                        </DrawerDescription>
                    </div>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-5 mobile-scroll">
                {/* Rule Presets */}
                <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Kiểu chơi phổ biến
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleApplyPreset("standard")}
                            className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all touch-haptic ${
                                preset === "standard"
                                    ? "bg-red-600/15 border-red-500/40 text-white"
                                    : "bg-[#141824] border-white/5 text-gray-400 hover:border-white/10"
                            }`}
                        >
                            <span className="text-xs font-bold flex items-center justify-between">
                                Đếm lá (4-3-2-1)
                                {preset === "standard" && <Check size={14} className="text-red-400" />}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                Nhất 4, Nhì 3, Ba 2, Bét 1
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleApplyPreset("nhat_an_tat")}
                            className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all touch-haptic ${
                                preset === "nhat_an_tat"
                                    ? "bg-red-600/15 border-red-500/40 text-white"
                                    : "bg-[#141824] border-white/5 text-gray-400 hover:border-white/10"
                            }`}
                        >
                            <span className="text-xs font-bold flex items-center justify-between">
                                Nhất Ăn Tất
                                {preset === "nhat_an_tat" && <Check size={14} className="text-red-400" />}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                Chỉ tính người về nhất
                            </span>
                        </button>
                    </div>
                </div>

                {/* Win/Lose Points */}
                <div className="space-y-2">
                    <h3 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        Hệ số điểm thứ tự về đích
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: "NHẤT", stateVal: nhat, setVal: setNhat, color: "text-amber-400" },
                            { label: "NHÌ", stateVal: nhi, setVal: setNhi, color: "text-slate-300" },
                            { label: "BA", stateVal: ba, setVal: setBa, color: "text-amber-600" },
                            { label: "BÉT", stateVal: bet, setVal: setBet, color: "text-rose-400" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5">
                                <Label className={`text-center text-[10px] font-black uppercase ${item.color}`}>
                                    {item.label}
                                </Label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={item.stateVal}
                                    onChange={(e) => item.setVal(e.target.value)}
                                    className="w-full h-11 rounded-xl bg-[#141824] border-white/[0.08] text-center text-base font-bold text-white focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-transparent font-mono"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Penalty Points */}
                <div className="space-y-2">
                    <h3 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        Hệ số phạt chặt & thối heo
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                        {[
                            { label: "HEO ĐỎ", value: heoDo, setVal: setHeoDo },
                            { label: "HEO ĐEN", value: heoDen, setVal: setHeoDen },
                            { label: "CHẾT HEO ĐỎ", value: chetHeoDo, setVal: setChetHeoDo },
                            { label: "CHẾT HEO ĐEN", value: chetHeoDen, setVal: setChetHeoDen },
                            { label: "CHẾT CHÁY", value: chetChay, setVal: setChetChay },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between p-2.5 rounded-2xl bg-[#141824] border border-white/[0.08] ${
                                    idx === 4 ? "col-span-2" : ""
                                }`}
                            >
                                <Label className="text-[11px] font-bold text-gray-300 uppercase">
                                    {item.label}
                                </Label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={item.value}
                                    onChange={(e) => item.setVal(e.target.value)}
                                    className="w-16 h-9 rounded-xl bg-white/5 border-white/10 text-center text-sm font-bold text-white font-mono focus-visible:ring-1 focus-visible:ring-red-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <DrawerFooter className="p-4 border-t border-white/[0.08] shrink-0 bg-[#0f1422]">
                <div className="grid grid-cols-2 gap-2.5 w-full">
                    <DrawerClose asChild>
                        <Button
                            variant="secondary"
                            className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold text-gray-300 border border-white/5"
                        >
                            Hủy bỏ
                        </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Button
                            onClick={handleCreateGame}
                            className="h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-sm font-bold text-white shadow-lg shadow-red-600/30"
                        >
                            Tạo bàn chơi
                        </Button>
                    </DrawerClose>
                </div>
            </DrawerFooter>
        </div>
    );
}
