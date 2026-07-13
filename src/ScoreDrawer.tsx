import {
    X,
    Trophy,
    AlertTriangle,
    CheckCircle2,
    Pencil,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DrawerClose,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
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

import type { ScoreDrawerProps } from "./components/score-drawer/types";
import { useScoreState } from "./components/score-drawer/useScoreState";
import RankSelection from "./components/score-drawer/RankSelection";
import AnPhatHeoPanel from "./components/score-drawer/AnPhatHeoPanel";
import ChetHeoPanel from "./components/score-drawer/ChetHeoPanel";
import ChetChayPanel from "./components/score-drawer/ChetChayPanel";
import DoiThongPanel from "./components/score-drawer/DoiThongPanel";
import ScoreSummary from "./components/score-drawer/ScoreSummary";

export type { ScoreDrawerProps };

export default function ScoreDrawer({
    players,
    onConfirm,
    initialData,
    roundNumber,
    onDelete,
}: ScoreDrawerProps) {
    const {
        ranks,
        setRanks,
        activeTab,
        setActiveTab,
        anHeoSelection,
        phatHeoSelection,
        chetHeoSelection,
        chetChaySelection,
        setChetChaySelection,
        doiThongSelection,
        getChetChayPenalty,
        isPlayerBurned,
        isPlayerEater,
        burnedCount,
        handlePlayerClick,
        toggleHeo,
        toggleDoiThong,
        clearDoiThong,
        clearAnHeo,
        clearPhatHeo,
        clearChetHeo,
        clearChetChay,
        hasActiveData,
        getHeoValues,
        getChetHeoValues,
        getDoiThongPenalty,
        getPlayerScore,
        allRanked,
        handleConfirm,
    } = useScoreState({ players, onConfirm, initialData });

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-[#0a0a0a] text-white font-sans sm:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0 bg-[#0f0f12]">
                <div className="flex items-center gap-3">
                    {initialData ? (
                        <div className="w-10 h-10 rounded-xl bg-orange-950/40 flex items-center justify-center text-orange-500">
                            <Pencil size={20} />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-950/40 flex items-center justify-center text-emerald-500">
                            <Trophy size={20} />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <DrawerTitle className="text-lg font-bold leading-tight text-white flex items-center gap-2">
                            <span>
                                {initialData ? "Chỉnh sửa" : "Ghi điểm"}
                            </span>
                            {initialData && roundNumber && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/20">
                                    ván #{roundNumber}
                                </span>
                            )}
                        </DrawerTitle>
                        <DrawerDescription className="text-[10px] text-gray-500 font-medium">
                            {initialData
                                ? "Sửa kết quả ván Tiến Lên"
                                : "Kết thúc ván Tiến Lên"}
                        </DrawerDescription>
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
                {/* Thu tu ve dich */}
                <RankSelection
                    players={players}
                    ranks={ranks}
                    isPlayerBurned={isPlayerBurned}
                    handlePlayerClick={handlePlayerClick}
                />

                {/* Tùy chọn phạt / thưởng */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                        Tùy chọn phạt / thưởng
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "CHẾT CHÁY",
                            "ĂN PHẠT HEO",
                            "CHẾT HEO",
                            "ĐÔI THÔNG",
                        ].map((item) => {
                            const isSelected = activeTab === item;
                            return (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`px-4 py-2 rounded-xl text-xs uppercase font-bold transition-all border relative ${
                                        isSelected
                                            ? "bg-[#00a67d] text-white border-[#00a67d]"
                                            : "bg-transparent text-gray-400 border-white/10 hover:border-white/20"
                                    }`}
                                >
                                    {item}
                                    {hasActiveData(item) && (
                                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-[#0a0a0a]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Tab Panel */}
                    <div className="bg-[#151517] rounded-3xl p-5 border border-white/[0.03] space-y-4">
                        {activeTab === "ĂN PHẠT HEO" && (
                            <AnPhatHeoPanel
                                players={players}
                                anHeoSelection={anHeoSelection}
                                phatHeoSelection={phatHeoSelection}
                                toggleHeo={toggleHeo}
                                clearAnHeo={clearAnHeo}
                                clearPhatHeo={clearPhatHeo}
                            />
                        )}

                        {activeTab === "CHẾT HEO" && (
                            <ChetHeoPanel
                                players={players}
                                chetHeoSelection={chetHeoSelection}
                                toggleHeo={toggleHeo}
                                clearChetHeo={clearChetHeo}
                            />
                        )}

                        {activeTab === "CHẾT CHÁY" && (
                            <ChetChayPanel
                                players={players}
                                chetChaySelection={chetChaySelection}
                                ranks={ranks}
                                setRanks={setRanks}
                                setChetChaySelection={setChetChaySelection}
                                clearChetChay={clearChetChay}
                                getChetChayPenalty={getChetChayPenalty}
                            />
                        )}

                        {activeTab === "ĐÔI THÔNG" && (
                            <DoiThongPanel
                                players={players}
                                doiThongSelection={doiThongSelection}
                                toggleDoiThong={toggleDoiThong}
                                clearDoiThong={clearDoiThong}
                                getDoiThongPenalty={getDoiThongPenalty}
                            />
                        )}
                    </div>
                </div>

                {/* Tong ket van nay */}
                <ScoreSummary
                    players={players}
                    isPlayerBurned={isPlayerBurned}
                    isPlayerEater={isPlayerEater}
                    getPlayerScore={getPlayerScore}
                    getChetChayPenalty={getChetChayPenalty}
                    burnedCount={burnedCount}
                    getHeoValues={getHeoValues}
                    anHeoSelection={anHeoSelection}
                    phatHeoSelection={phatHeoSelection}
                    getChetHeoValues={getChetHeoValues}
                    chetHeoSelection={chetHeoSelection}
                    getDoiThongPenalty={getDoiThongPenalty}
                    doiThongSelection={doiThongSelection}
                />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 shrink-0 bg-[#0f0f12] flex flex-col gap-3">
                {!allRanked && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-[#2a1b14] border border-orange-950/40 text-[#df8743] rounded-2xl text-xs font-bold">
                        <AlertTriangle size={14} />
                        Vui lòng chọn thứ tự về đích
                    </div>
                )}

                <div className="flex gap-3 w-full">
                    {initialData && onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-14 px-4 rounded-2xl bg-red-950/20 hover:bg-red-950/40 text-red-500 border border-red-500/20 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                                >
                                    <Trash2 size={20} className="size-5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                                size="sm"
                                className="bg-[#0a0a0a] border-white/5 text-white max-w-[90vw] rounded-2xl"
                            >
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-lg font-bold text-white">
                                        Xác nhận xóa ván đấu
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-gray-400">
                                        Bạn có chắc chắn muốn xóa ván #
                                        {roundNumber} này không? Hành động này
                                        không thể hoàn tác.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="h-11 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-white">
                                        Hủy
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onDelete}
                                        className="h-11 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 border-0"
                                    >
                                        Xóa
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <DrawerClose
                        asChild
                        disabled={!allRanked}
                        className="flex-1"
                    >
                        <Button
                            onClick={handleConfirm}
                            disabled={!allRanked}
                            className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-base transition-all ${
                                allRanked
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95"
                                    : "bg-emerald-950/30 text-emerald-900/60 cursor-not-allowed"
                            }`}
                        >
                            <CheckCircle2 size={18} />
                            Xác nhận ghi điểm
                        </Button>
                    </DrawerClose>
                </div>
            </div>
        </div>
    );
}

