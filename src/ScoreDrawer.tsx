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
import ChantDePanel from "./components/score-drawer/ChantDePanel";
import AnPhatHeoPanel from "./components/score-drawer/AnPhatHeoPanel";
import ChetHeoPanel from "./components/score-drawer/ChetHeoPanel";
import ChetChayPanel from "./components/score-drawer/ChetChayPanel";
import ScoreSummary from "./components/score-drawer/ScoreSummary";
import { useVisualViewport } from "./hooks/useVisualViewport";

export type { ScoreDrawerProps };

export default function ScoreDrawer({
    players,
    onConfirm,
    initialData,
    roundNumber,
    onDelete,
}: ScoreDrawerProps) {
    const { bottomOffset } = useVisualViewport();
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
        chatEvents,
        addChatEvent,
        updateChatEvent,
        removeChatEvent,
        getChetChayPenalty,
        isPlayerBurned,
        isPlayerEater,
        burnedCount,
        handlePlayerClick,
        toggleHeo,
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
        <div className="flex flex-col flex-1 min-h-0 bg-[#0c101b] text-white font-sans">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto my-2 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08] shrink-0 bg-[#0f1422]">
                <div className="flex items-center gap-3">
                    {initialData ? (
                        <div className="w-10 h-10 rounded-xl bg-orange-950/40 flex items-center justify-center text-orange-400">
                            <Pencil size={20} />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-950/40 flex items-center justify-center text-emerald-400">
                            <Trophy size={20} />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <DrawerTitle className="text-base font-bold leading-tight text-white flex items-center gap-2">
                            <span>
                                {initialData ? "Chỉnh sửa kết quả" : "Ghi điểm ván"}
                            </span>
                            {roundNumber && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                                    Ván #{roundNumber}
                                </span>
                            )}
                        </DrawerTitle>
                        <DrawerDescription className="text-[11px] text-gray-400">
                            {initialData
                                ? "Cập nhật lại thứ tự hoặc tiền phạt"
                                : "Chọn thứ hạng và các trường hợp phạt"}
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
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 mobile-scroll">
                {/* Thu tu ve dich */}
                <RankSelection
                    players={players}
                    ranks={ranks}
                    isPlayerBurned={isPlayerBurned}
                    handlePlayerClick={handlePlayerClick}
                />

                {/* Tùy chọn phạt / thưởng */}
                <div className="space-y-2.5">
                    <h3 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        Tùy chọn phạt / chặt heo
                    </h3>
                    <div className="flex items-center gap-2 overflow-x-auto mobile-scroll pb-1">
                        {[
                            "ĂN PHẠT HEO",
                            "CHẶT ĐÈ",
                            "CHẾT HEO",
                            "CHẾT CHÁY",
                        ].map((item) => {
                            const isSelected = activeTab === item;
                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setActiveTab(item)}
                                    className={`px-3.5 py-2 rounded-xl text-xs uppercase font-bold transition-all border whitespace-nowrap relative shrink-0 touch-haptic ${
                                        isSelected
                                            ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30"
                                            : "bg-[#141824] text-gray-400 border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    {item}
                                    {hasActiveData(item) && (
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border-2 border-[#0c101b]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Tab Panel */}
                    <div className="bg-[#151517] rounded-3xl p-5 border border-white/[0.03] space-y-4">
                        {activeTab === "CHẶT ĐÈ" && (
                            <ChantDePanel
                                players={players}
                                chatEvents={chatEvents}
                                onAddEvent={addChatEvent}
                                onUpdateEvent={updateChatEvent}
                                onRemoveEvent={removeChatEvent}
                                getHeoValues={getHeoValues}
                                getDoiThongPenalty={getDoiThongPenalty}
                            />
                        )}

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
                />
            </div>

            {/* Footer */}
            <div
                className="p-4 border-t border-white/5 shrink-0 bg-[#0f0f12] flex flex-col gap-3 transition-[padding] duration-150"
                style={{ paddingBottom: `calc(1rem + ${bottomOffset}px)` }}
            >
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
