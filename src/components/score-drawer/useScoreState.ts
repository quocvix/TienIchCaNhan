import { useState } from "react";
import type { Rank, ScoreDrawerProps } from "./types";

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
    const [doiThongSelection, setDoiThongSelection] = useState<
        Record<string, { an: number; phat: number }>
    >(initialData?.doiThongSelection || {});

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

    const isPlayerBurned = (name: string): boolean => {
        return chetChaySelection[name] === "chay";
    };

    const isPlayerEater = (name: string): boolean => {
        return chetChaySelection[name] === "an";
    };

    const burnedCount = players.filter((p) => isPlayerBurned(p)).length;

    const handlePlayerClick = (name: string) => {
        // Người bị chết cháy không được tick thứ tự về đích
        if (isPlayerBurned(name)) return;

        const rankOrder: Rank[] = ["NHẤT", "NHÌ", "BA", "BÉT"];

        if (ranks[name]) {
            // Remove rank
            const newRanks = { ...ranks };
            delete newRanks[name];
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
                    [name]: nextRank,
                });
            }
        }
    };

    const toggleHeo = (
        name: string,
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

        const current = selection[name] || { do: 0, den: 0 };
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
            [name]: {
                ...current,
                [color]: nextCount,
            },
        });
    };

    const toggleDoiThong = (name: string, type: "an" | "phat") => {
        const current = doiThongSelection[name] || { an: 0, phat: 0 };
        const currentCount = current[type];

        let nextCount = 0;
        if (currentCount < 5) {
            nextCount = currentCount + 1;
        } else {
            nextCount = 0;
        }

        setDoiThongSelection({
            ...doiThongSelection,
            [name]: {
                ...current,
                [type]: nextCount,
            },
        });
    };

    const clearDoiThong = (name: string) => {
        setDoiThongSelection({
            ...doiThongSelection,
            [name]: { an: 0, phat: 0 },
        });
    };

    const clearAnHeo = (name: string) => {
        setAnHeoSelection({
            ...anHeoSelection,
            [name]: { do: 0, den: 0 },
        });
    };

    const clearPhatHeo = (name: string) => {
        setPhatHeoSelection({
            ...phatHeoSelection,
            [name]: { do: 0, den: 0 },
        });
    };

    const clearChetHeo = (name: string) => {
        setChetHeoSelection({
            ...chetHeoSelection,
            [name]: { do: 0, den: 0 },
        });
    };

    const clearChetChay = (name: string) => {
        setChetChaySelection({
            ...chetChaySelection,
            [name]: "",
        });
    };

    const hasActiveData = (tabName: string): boolean => {
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
        if (tabName === "ĐÔI THÔNG") {
            return Object.values(doiThongSelection).some(
                (val) => val && (val.an > 0 || val.phat > 0),
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

    const getPlayerScore = (name: string): number => {
        let score = 0;
        if (isPlayerBurned(name)) {
            score -= getChetChayPenalty();
        } else {
            score += getScoreForRank(ranks[name] || null);
        }
        // Người "ăn" được +penalty cho mỗi người bị cháy
        if (isPlayerEater(name)) {
            score += getChetChayPenalty() * burnedCount;
        }

        // Tính điểm Ăn Heo / Phạt Heo
        const heoValues = getHeoValues();
        const anHeo = anHeoSelection[name];
        if (anHeo) {
            score += heoValues.do * (anHeo.do || 0);
            score += heoValues.den * (anHeo.den || 0);
        }

        const phatHeo = phatHeoSelection[name];
        if (phatHeo) {
            score -= heoValues.do * (phatHeo.do || 0);
            score -= heoValues.den * (phatHeo.den || 0);
        }

        // Tính điểm Chết Heo (thối heo)
        const chetHeoValues = getChetHeoValues();
        const chetHeo = chetHeoSelection[name];
        if (chetHeo) {
            score -= chetHeoValues.do * (chetHeo.do || 0);
            score -= chetHeoValues.den * (chetHeo.den || 0);
        }

        // Tính điểm Đôi Thông
        const dtValue = getDoiThongPenalty();
        const dt = doiThongSelection[name];
        if (dt) {
            score += dtValue * (dt.an || 0);
            score -= dtValue * (dt.phat || 0);
        }

        return score;
    };

    // Tất cả người chơi KHÔNG bị cháy phải được xếp hạng
    const activePlayers = players.filter((p) => !isPlayerBurned(p));
    const allRanked =
        activePlayers.length > 0 && activePlayers.every((p) => ranks[p]);

    const handleConfirm = () => {
        if (!allRanked) return;
        const scores: Record<string, number> = {};
        players.forEach((p) => {
            scores[p] = getPlayerScore(p);
        });
        onConfirm(scores, {
            ranks,
            anHeoSelection,
            phatHeoSelection,
            chetHeoSelection,
            chetChaySelection,
            doiThongSelection,
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
        doiThongSelection,
        getGameSettings,
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
        getScoreForRank,
        getHeoValues,
        getChetHeoValues,
        getDoiThongPenalty,
        getPlayerScore,
        allRanked,
        handleConfirm,
    };
}
