interface ScoreSummaryProps {
    players: string[];
    isPlayerBurned: (name: string) => boolean;
    isPlayerEater: (name: string) => boolean;
    getPlayerScore: (name: string) => number;
    getChetChayPenalty: () => number;
    burnedCount: number;
    getHeoValues: () => { do: number; den: number };
    anHeoSelection: Record<string, { do: number; den: number }>;
    phatHeoSelection: Record<string, { do: number; den: number }>;
    getChetHeoValues: () => { do: number; den: number };
    chetHeoSelection: Record<string, { do: number; den: number }>;
    getDoiThongPenalty: () => number;
    doiThongSelection: Record<string, { an: number; phat: number }>;
}

export default function ScoreSummary({
    players,
    isPlayerBurned,
    isPlayerEater,
    getPlayerScore,
    getChetChayPenalty,
    burnedCount,
    getHeoValues,
    anHeoSelection,
    phatHeoSelection,
    getChetHeoValues,
    chetHeoSelection,
    getDoiThongPenalty,
    doiThongSelection,
}: ScoreSummaryProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Tổng kết ván này
            </h3>
            <div className="bg-[#151517] rounded-3xl p-5 border border-white/[0.03] space-y-4">
                {players.map((name) => {
                    const burned = isPlayerBurned(name);
                    const eater = isPlayerEater(name);
                    const score = getPlayerScore(name);
                    return (
                        <div
                            key={name}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-sm font-bold ${
                                        burned
                                            ? "text-red-400"
                                            : eater
                                              ? "text-emerald-400"
                                              : "text-gray-300"
                                    }`}
                                >
                                    {name}
                                </span>
                                {burned && (
                                    <span className="text-[9px] font-bold text-red-400/70 bg-red-500/10 px-1.5 py-0.5 rounded">
                                        CHÁY
                                    </span>
                                )}
                                {eater && burnedCount > 0 && (
                                    <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                        ĂN +{getChetChayPenalty() * burnedCount}
                                    </span>
                                )}
                                {(() => {
                                    const heoValues = getHeoValues();
                                    const anHeo = anHeoSelection[name];
                                    const phatHeo = phatHeoSelection[name];
                                    return (
                                        <>
                                            {anHeo && (
                                                <>
                                                    {anHeo.do > 0 && (
                                                        <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                            HEO ĐỎ
                                                            {anHeo.do > 1
                                                                ? ` x${anHeo.do}`
                                                                : ""}{" "}
                                                            (+
                                                            {heoValues.do *
                                                                anHeo.do}
                                                            )
                                                        </span>
                                                    )}
                                                    {anHeo.den > 0 && (
                                                        <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                            HEO ĐEN
                                                            {anHeo.den > 1
                                                                ? ` x${anHeo.den}`
                                                                : ""}{" "}
                                                            (+
                                                            {heoValues.den *
                                                                anHeo.den}
                                                            )
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {phatHeo && (
                                                <>
                                                    {phatHeo.do > 0 && (
                                                        <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                            PHẠT HEO ĐỎ
                                                            {phatHeo.do > 1
                                                                ? ` x${phatHeo.do}`
                                                                : ""}{" "}
                                                            (-
                                                            {heoValues.do *
                                                                phatHeo.do}
                                                            )
                                                        </span>
                                                    )}
                                                    {phatHeo.den > 0 && (
                                                        <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                            PHẠT HEO ĐEN
                                                            {phatHeo.den > 1
                                                                ? ` x${phatHeo.den}`
                                                                : ""}{" "}
                                                            (-
                                                            {heoValues.den *
                                                                phatHeo.den}
                                                            )
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {(() => {
                                                const chetHeoValues =
                                                    getChetHeoValues();
                                                const chetHeo =
                                                    chetHeoSelection[name];
                                                if (!chetHeo) return null;
                                                return (
                                                    <>
                                                        {chetHeo.do > 0 && (
                                                            <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                THỐI HEO ĐỎ
                                                                {chetHeo.do > 1
                                                                    ? ` x${chetHeo.do}`
                                                                    : ""}{" "}
                                                                (-
                                                                {chetHeoValues.do *
                                                                    chetHeo.do}
                                                                )
                                                            </span>
                                                        )}
                                                        {chetHeo.den > 0 && (
                                                            <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                THỐI HEO ĐEN
                                                                {chetHeo.den > 1
                                                                    ? ` x${chetHeo.den}`
                                                                    : ""}{" "}
                                                                (-
                                                                {chetHeoValues.den *
                                                                    chetHeo.den}
                                                                )
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                            {(() => {
                                                const dtValue =
                                                    getDoiThongPenalty();
                                                const dt =
                                                    doiThongSelection[name];
                                                if (!dt) return null;
                                                return (
                                                    <>
                                                        {dt.an > 0 && (
                                                            <span className="text-[9px] font-bold text-emerald-400/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                                ĐÔI THÔNG
                                                                {dt.an > 1
                                                                    ? ` x${dt.an}`
                                                                    : ""}{" "}
                                                                (+
                                                                {dtValue *
                                                                    dt.an}
                                                                )
                                                            </span>
                                                        )}
                                                        {dt.phat > 0 && (
                                                            <span className="text-[9px] font-bold text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                                                PHẠT ĐÔI THÔNG
                                                                {dt.phat > 1
                                                                    ? ` x${dt.phat}`
                                                                    : ""}{" "}
                                                                (-
                                                                {dtValue *
                                                                    dt.phat}
                                                                )
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </>
                                    );
                                })()}
                            </div>
                            <span
                                className={`text-sm font-bold ${
                                    score > 0
                                        ? "text-emerald-500"
                                        : score < 0
                                          ? "text-red-400"
                                          : "text-gray-500"
                                }`}
                            >
                                {score > 0 ? `+${score}` : score}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
