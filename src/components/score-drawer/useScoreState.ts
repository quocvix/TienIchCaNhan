import { useState } from "react";
import type { Rank, ScoreDrawerProps, ChatEvent } from "./types";
import { calculateEventScores } from "./ChantDePanel";

export function useScoreState({
    players,
    onConfirm,
    initialData,
}: Pick<ScoreDrawerProps, "players" | "onConfirm" | "initialData">) {
    const [ranks, setRanks] = useState<Record<string, Rank | null>>(
        initialData?.ranks || {},
    );
    const [activeTab, setActiveTab] = useState<string>("ĂN PHẠT HEO");
    const [anHeoSelection, setAnHeoSelection] = useState<
        Record<string, { do: number; den: number }>
    >(initialData?.anHeoSelection || {});
    const [phatHeoSelection, setPhatHeoSelection] = useState<
        Record<string, { do: number; den: number }>
    >(initialData?.phatHeoSelection || {});
    const [chetHeoSelection, setChetHeoSelection] = useState<
        Record<string, { do: number; den: number }>
    >(initialData?.chetHeoSelection || {});
    const [chetChaySelection, setChetChaySelection] = useState<
        Record<string, "an" | "chay" | "">
    >(initialData?.chetChaySelection || {});
    const [chatEvents, setChatEvents] = useState<ChatEvent[]>(
        initialData?.chatEvents || [],
    );

    const getGameSettings = () => {
        const query = new URLSearchParams(window.location.search);
        const gameId = query.get("id");
        if (gameId) {
            const stored = localStorage.getItem("game_history");
            if (stored) {
                const games = JSON.parse(stored);
                const found = games.find((g: any) => g.id === gameId);
                if (found && found.settings) return found.settings;
            }
        }
        return null;
    };

    const getChetChayPenalty = (): number => {
        const settings = getGameSettings();
        return settings?.penalties?.chetChay ?? 4;
    };

    const isPlayerBurned = (id: string): boolean => {
        return chetChaySelection[id] === "chay";
    };

    const isPlayerEater = (id: string): boolean => {
        return chetChaySelection[id] === "an";
    };

    const burnedCount = players.filter((p) => isPlayerBurned(p.id)).length;

    const handlePlayerClick = (id: string) => {
        // Người bị chết cháy không được tick thứ tự về đích
        if (isPlayerBurned(id)) return;

        const rankOrder: Rank[] = ["NHẤT", "NHÌ", "BA", "BÉT"];

        if (ranks[id]) {
            // Remove rank
            const newRanks = { ...ranks };
            delete newRanks[id];
            setRanks(newRanks);
        } else {
            // Find next available rank
            const assignedRanks = Object.values(ranks).filter(
                Boolean,
            ) as Rank[];
            const nextRank = rankOrder.find((r) => !assignedRanks.includes(r));
            if (nextRank) {
                setRanks({
                    ...ranks,
                    [id]: nextRank,
                });
            }
        }
    };

    const toggleHeo = (
        id: string,
        color: "do" | "den",
        type: "an" | "phat" | "chet",
    ) => {
        const selection =
            type === "an"
                ? anHeoSelection
                : type === "phat"
                  ? phatHeoSelection
                  : chetHeoSelection;
        const setSelection =
            type === "an"
                ? setAnHeoSelection
                : type === "phat"
                  ? setPhatHeoSelection
                  : setChetHeoSelection;

        const current = selection[id] || { do: 0, den: 0 };
        const currentCount = current[color];

        let nextCount = 0;
        if (currentCount === 0) {
            nextCount = 1;
        } else if (currentCount === 1) {
            nextCount = 2;
        } else {
            nextCount = 0;
        }

        setSelection({
            ...selection,
            [id]: {
                ...current,
                [color]: nextCount,
            },
        });
    };

    const clearAnHeo = (id: string) => {
        setAnHeoSelection({
            ...anHeoSelection,
            [id]: { do: 0, den: 0 },
        });
    };

    const clearPhatHeo = (id: string) => {
        setPhatHeoSelection({
            ...phatHeoSelection,
            [id]: { do: 0, den: 0 },
        });
    };

    const clearChetHeo = (id: string) => {
        setChetHeoSelection({
            ...chetHeoSelection,
            [id]: { do: 0, den: 0 },
        });
    };

    const clearChetChay = (id: string) => {
        setChetChaySelection({
            ...chetChaySelection,
            [id]: "",
        });
    };

    const addChatEvent = () => {
        const defaultSeq = players.length >= 2 ? [players[0].id, players[1].id] : [];
        setChatEvents([
            ...chatEvents,
            {
                id: crypto.randomUUID(),
                heoDo: 0,
                heoDen: 0,
                doiThong: 1,
                sequence: defaultSeq,
            },
        ]);
    };

    const updateChatEvent = (updated: ChatEvent) => {
        setChatEvents(chatEvents.map((ev) => (ev.id === updated.id ? updated : ev)));
    };

    const removeChatEvent = (id: string) => {
        setChatEvents(chatEvents.filter((ev) => ev.id !== id));
    };

    const hasActiveData = (tabName: string): boolean => {
        if (tabName === "CHẶT ĐÈ") {
            return chatEvents.some(
                (ev) =>
                    ev.sequence.length >= 2 &&
                    (ev.heoDo > 0 || ev.heoDen > 0 || ev.doiThong > 0),
            );
        }
        if (tabName === "ĂN PHẠT HEO") {
            return (
                Object.values(anHeoSelection).some(
                    (v) => v && (v.do > 0 || v.den > 0),
                ) ||
                Object.values(phatHeoSelection).some(
                    (v) => v && (v.do > 0 || v.den > 0),
                )
            );
        }
        if (tabName === "CHẾT HEO") {
            return Object.values(chetHeoSelection).some(
                (v) => v && (v.do > 0 || v.den > 0),
            );
        }
        if (tabName === "CHẾT CHÁY") {
            return Object.values(chetChaySelection).some(
                (val) => val === "an" || val === "chay",
            );
        }
        return false;
    };

    const getScoreForRank = (rank: Rank | null): number => {
        let nhat = 3,
            nhi = 2,
            ba = 1,
            bet = 0;

        const settings = getGameSettings();
        if (settings) {
            nhat = settings.nhat ?? 3;
            nhi = settings.nhi ?? 2;
            ba = settings.ba ?? 1;
            bet = settings.bet ?? 0;
        }

        if (rank === "NHẤT") return nhat;
        if (rank === "NHÌ") return nhi;
        if (rank === "BA") return ba;
        if (rank === "BÉT") return bet;
        return 0;
    };

    const getHeoValues = () => {
        const settings = getGameSettings();
        return {
            do: settings?.penalties?.heoDo ?? 4,
            den: settings?.penalties?.heoDen ?? 2,
        };
    };

    const getChetHeoValues = () => {
        const settings = getGameSettings();
        return {
            do: settings?.penalties?.chetHeoDo ?? 2,
            den: settings?.penalties?.chetHeoDen ?? 1,
        };
    };

    const getDoiThongPenalty = (): number => {
        const settings = getGameSettings();
        return settings?.penalties?.doiThong ?? 4;
    };

    const getPlayerScore = (id: string): number => {
        let score = 0;
        if (isPlayerBurned(id)) {
            score -= getChetChayPenalty();
        } else {
            score += getScoreForRank(ranks[id] || null);
        }
        // Người "ăn" được +penalty cho mỗi người bị cháy
        if (isPlayerEater(id)) {
            score += getChetChayPenalty() * burnedCount;
        }

        // Tính điểm Ăn Heo / Phạt Heo (Legacy & đơn lẻ)
        const heoValues = getHeoValues();
        const anHeo = anHeoSelection[id];
        if (anHeo) {
            score += heoValues.do * (anHeo.do || 0);
            score += heoValues.den * (anHeo.den || 0);
        }

        const phatHeo = phatHeoSelection[id];
        if (phatHeo) {
            score -= heoValues.do * (phatHeo.do || 0);
            score -= heoValues.den * (phatHeo.den || 0);
        }

        // Tính điểm Chết Heo (thối heo)
        const chetHeoValues = getChetHeoValues();
        const chetHeo = chetHeoSelection[id];
        if (chetHeo) {
            score -= chetHeoValues.do * (chetHeo.do || 0);
            score -= chetHeoValues.den * (chetHeo.den || 0);
        }

        // Tính điểm Chặt / Chặt Đè (Cut Stacking)
        const dtValue = getDoiThongPenalty();
        chatEvents.forEach((ev) => {
            const evScores = calculateEventScores(ev, heoValues, dtValue);
            score += evScores[id] || 0;
        });

        return score;
    };

    // Tất cả người chơi KHÔNG bị cháy phải được xếp hạng
    const activePlayers = players.filter((p) => !isPlayerBurned(p.id));
    const allRanked =
        activePlayers.length > 0 && activePlayers.every((p) => ranks[p.id]);

    const handleConfirm = () => {
        if (!allRanked) return;
        const scores: Record<string, number> = {};
        players.forEach((p) => {
            scores[p.id] = getPlayerScore(p.id);
        });
        onConfirm(scores, {
            ranks,
            anHeoSelection,
            phatHeoSelection,
            chetHeoSelection,
            chetChaySelection,
            chatEvents,
        });
    };

    return {
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
        getGameSettings,
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
        getScoreForRank,
        getHeoValues,
        getChetHeoValues,
        getDoiThongPenalty,
        getPlayerScore,
        allRanked,
        handleConfirm,
    };
}
