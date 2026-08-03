import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Player, ChatEvent } from "./types";

interface ChantDePanelProps {
    players: Player[];
    chatEvents: ChatEvent[];
    onAddEvent: () => void;
    onUpdateEvent: (event: ChatEvent) => void;
    onRemoveEvent: (id: string) => void;
    getHeoValues: () => { do: number; den: number };
    getDoiThongPenalty?: () => number;
}

export function calculateEventScores(
    event: ChatEvent,
    heoValues: { do: number; den: number },
    _doiThongPenalty: number = 0,
): Record<string, number> {
    const scores: Record<string, number> = {};
    const basePoints =
        (event.heoDo || 0) * heoValues.do + (event.heoDen || 0) * heoValues.den;

    if (basePoints <= 0 || event.sequence.length < 2) {
        return scores;
    }

    const len = event.sequence.length;

    if (len === 2) {
        // Chặt đơn: P0 bị phạt -base, P1 được +base
        const p0 = event.sequence[0];
        const p1 = event.sequence[1];
        if (p0) scores[p0] = (scores[p0] || 0) - basePoints;
        if (p1) scores[p1] = (scores[p1] || 0) + basePoints;
    } else {
        // Chặt đè: P0 thoát phạt (0), người bị chặt đè sau cùng P(len-2) bị phạt gấp đôi,
        // Người chặt đè sau cùng P(len-1) được ăn gấp đôi.
        const multiplier = Math.pow(2, len - 2);
        const finalPoints = basePoints * multiplier;

        const victim = event.sequence[len - 2];
        const winner = event.sequence[len - 1];

        if (victim) scores[victim] = (scores[victim] || 0) - finalPoints;
        if (winner) scores[winner] = (scores[winner] || 0) + finalPoints;
    }

    return scores;
}

export default function ChantDePanel({
    players,
    chatEvents,
    onAddEvent,
    onUpdateEvent,
    onRemoveEvent,
    getHeoValues,
}: ChantDePanelProps) {
    const heoValues = getHeoValues();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Lượt Chặt Đè (Tiến Lên)
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Heo đỏ: {heoValues.do}đ • Heo đen: {heoValues.den}đ
                </span>
            </div>

            {chatEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] gap-3">
                    <p className="text-xs text-gray-400 font-medium text-center">
                        Chưa có lượt chặt đè nào trong ván này.
                    </p>
                    <Button
                        onClick={onAddEvent}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl h-9 px-4"
                    >
                        <Plus size={14} className="mr-1.5" />
                        Thêm lượt chặt đè
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {chatEvents.map((event, eventIdx) => {
                        const eventScores = calculateEventScores(
                            event,
                            heoValues,
                        );

                        const toggleCard = (type: "heoDo" | "heoDen") => {
                            const current = event[type] || 0;
                            const next =
                                current === 0 ? 1 : current === 1 ? 2 : 0;
                            onUpdateEvent({ ...event, [type]: next });
                        };

                        const setSequencePlayer = (
                            index: number,
                            playerId: string,
                        ) => {
                            const newSeq = [...event.sequence];
                            newSeq[index] = playerId;
                            onUpdateEvent({ ...event, sequence: newSeq });
                        };

                        const addSequenceStep = () => {
                            if (event.sequence.length < players.length) {
                                const unused = players.find(
                                    (p) => !event.sequence.includes(p.id),
                                );
                                onUpdateEvent({
                                    ...event,
                                    sequence: [
                                        ...event.sequence,
                                        unused?.id || "",
                                    ],
                                });
                            }
                        };

                        const removeLastSequenceStep = () => {
                            if (event.sequence.length > 2) {
                                onUpdateEvent({
                                    ...event,
                                    sequence: event.sequence.slice(0, -1),
                                });
                            }
                        };

                        return (
                            <div
                                key={event.id}
                                className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 relative"
                            >
                                {/* Header of Event */}
                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-xs font-bold text-gray-300">
                                        Lượt chặt đè #{eventIdx + 1}
                                    </span>
                                    <button
                                        onClick={() => onRemoveEvent(event.id)}
                                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Step 1: Select Cards */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        1. Chọn heo bị chặt:
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleCard("heoDo")}
                                            className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all border flex items-center justify-center gap-2 active:scale-95 ${
                                                event.heoDo > 0
                                                    ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-sm"
                                                    : "bg-[#121214] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                                            }`}
                                        >
                                            <span>Heo Đỏ</span>
                                            {event.heoDo > 1 && (
                                                <span className="px-1.5 py-0.5 text-xs rounded-md bg-red-500/30 font-extrabold">
                                                    x{event.heoDo}
                                                </span>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleCard("heoDen")}
                                            className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all border flex items-center justify-center gap-2 active:scale-95 ${
                                                event.heoDen > 0
                                                    ? "bg-white/20 text-white border-white/40 shadow-sm"
                                                    : "bg-[#121214] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                                            }`}
                                        >
                                            <span>Heo Đen</span>
                                            {event.heoDen > 1 && (
                                                <span className="px-1.5 py-0.5 text-xs rounded-md bg-white/30 font-extrabold text-white">
                                                    x{event.heoDen}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Step 2: Sequence of Cuts */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                            2. Thứ tự chặt / chặt đè:
                                        </span>
                                        {event.sequence.length <
                                            players.length && (
                                            <button
                                                type="button"
                                                onClick={addSequenceStep}
                                                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
                                            >
                                                + Chặt đè tiếp
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {event.sequence.map(
                                            (selectedId, sIdx) => {
                                                const roleLabel =
                                                    sIdx === 0
                                                        ? "Ra heo (Bị chặt)"
                                                        : sIdx === 1
                                                          ? "Người Chặt"
                                                          : `Chặt Đè Lần ${sIdx - 1}`;

                                                return (
                                                    <div
                                                        key={sIdx}
                                                        className="flex flex-col gap-2 bg-[#121214] p-3 rounded-2xl border border-white/[0.04]"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-bold text-gray-400">
                                                                {sIdx + 1}.{" "}
                                                                {roleLabel}:
                                                            </span>
                                                            {sIdx >= 2 &&
                                                                sIdx ===
                                                                    event
                                                                        .sequence
                                                                        .length -
                                                                        1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={
                                                                            removeLastSequenceStep
                                                                        }
                                                                        className="text-gray-500 hover:text-red-400 text-[10px] font-bold flex items-center gap-1"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                        Xóa lượt
                                                                        này
                                                                    </button>
                                                                )}
                                                        </div>

                                                        {/* Clickable Player Chips */}
                                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                                            {players.map(
                                                                (p) => {
                                                                    const isSelected =
                                                                        selectedId ===
                                                                        p.id;
                                                                    return (
                                                                        <button
                                                                            key={
                                                                                p.id
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setSequencePlayer(
                                                                                    sIdx,
                                                                                    p.id,
                                                                                )
                                                                            }
                                                                            className={`py-3 px-3 rounded-2xl text-sm font-bold transition-all border text-center truncate active:scale-95 ${
                                                                                isSelected
                                                                                    ? "bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
                                                                                    : "bg-[#1c1c1e] text-gray-300 border-white/10 hover:border-white/20 hover:text-white"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                p.name
                                                                            }
                                                                        </button>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                {/* Step 3: Event Score Result Preview */}
                                {Object.keys(eventScores).length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                                            Điểm lượt này:
                                        </span>
                                        {players.map((p) => {
                                            const sc = eventScores[p.id] || 0;
                                            if (
                                                sc === 0 &&
                                                !event.sequence.includes(p.id)
                                            )
                                                return null;
                                            const isFreed =
                                                sc === 0 &&
                                                event.sequence.includes(p.id);
                                            return (
                                                <span
                                                    key={p.id}
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${
                                                        sc > 0
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                            : sc < 0
                                                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                                    }`}
                                                >
                                                    {p.name}:{" "}
                                                    {sc > 0 ? `+${sc}` : sc}
                                                    {isFreed ? " (Thoát)" : ""}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <Button
                        onClick={onAddEvent}
                        variant="outline"
                        className="w-full border-dashed border-white/10 hover:border-white/20 bg-transparent text-gray-300 text-xs font-bold rounded-xl h-10"
                    >
                        <Plus size={14} className="mr-1.5" />
                        Thêm lượt chặt đè khác
                    </Button>
                </div>
            )}
        </div>
    );
}
