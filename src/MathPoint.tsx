import { useEffect, useMemo, useState } from "react";
import {
    Moon,
    Sun,
    Trash2,
    Plus,
    Edit2,
    Check,
    X,
    RotateCcw,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "./components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";
import { useTheme } from "./components/theme-provider";

const STORAGE_KEY = "score-tracker-flex-v1";
const DEFAULT_PLAYER_COUNT = 4;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 12;

interface Player {
    id: number;
    name: string;
}

interface Round {
    id: string;
    scores: number[];
}

interface CumulativeRow {
    id: string;
    roundNumber: number;
    totals: number[];
}

interface RankedPlayer {
    id: number;
    name: string;
    score: number;
}

interface DerivedData {
    totals: number[];
    cumulativeByRound: CumulativeRow[];
    ranking: RankedPlayer[];
}

interface SavedState {
    players?: Player[];
    rounds?: Round[];
    currentRound?: string[];
}

const createPlayers = (count: number): Player[] =>
    Array.from({ length: count }, (_, index) => ({
        id: Date.now() + index + Math.random(),
        name: `Người chơi ${index + 1}`,
    }));

const createEmptyRoundInput = (count: number): string[] =>
    Array(count).fill("");

const normalizeScore = (value: string | number): number => Number(value || 0);

const buildDerivedData = (rounds: Round[], players: Player[]): DerivedData => {
    const totals: number[] = Array(players.length).fill(0);

    const cumulativeByRound: CumulativeRow[] = rounds.map((round, index) => {
        round.scores.forEach((score, scoreIndex) => {
            totals[scoreIndex] += normalizeScore(score);
        });

        return {
            id: round.id,
            roundNumber: index + 1,
            totals: [...totals],
        };
    });

    const ranking: RankedPlayer[] = players
        .map((player, index) => ({
            id: player.id,
            name: player.name,
            score: totals[index] || 0,
        }))
        .sort((a, b) => b.score - a.score);

    return { totals, cumulativeByRound, ranking };
};

const createInitialState = () => ({
    players: createPlayers(DEFAULT_PLAYER_COUNT),
    rounds: [] as Round[],
    currentRound: createEmptyRoundInput(DEFAULT_PLAYER_COUNT),
    editingRoundId: null as string | null,
    editingScores: [] as string[],
});

const loadInitialState = () => {
    if (typeof window === "undefined") {
        return createInitialState();
    }

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            return createInitialState();
        }

        const parsed: SavedState = JSON.parse(saved);
        const savedPlayers: Player[] = Array.isArray(parsed.players)
            ? parsed.players
            : createPlayers(DEFAULT_PLAYER_COUNT);
        const playerCount = Math.max(
            MIN_PLAYERS,
            savedPlayers.length || DEFAULT_PLAYER_COUNT,
        );

        return {
            players: savedPlayers,
            rounds: Array.isArray(parsed.rounds)
                ? parsed.rounds.map((round) => ({
                      ...round,
                      scores: Array.from({ length: playerCount }, (_, index) =>
                          normalizeScore(round.scores?.[index]),
                      ),
                  }))
                : [],
            currentRound: Array.from(
                { length: playerCount },
                (_, index) => parsed.currentRound?.[index] ?? "",
            ),
            editingRoundId: null as string | null,
            editingScores: [] as string[],
        };
    } catch (error) {
        return createInitialState();
    }
};

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Chuyển giao diện</span>
        </Button>
    );
}

export default function ScoreTrackerFlexiblePlayers() {
    const [players, setPlayers] = useState<Player[]>(
        () => loadInitialState().players,
    );
    const [rounds, setRounds] = useState<Round[]>(
        () => loadInitialState().rounds,
    );
    const [currentRound, setCurrentRound] = useState<string[]>(
        () => loadInitialState().currentRound,
    );
    const [editingRoundId, setEditingRoundId] = useState<string | null>(
        () => loadInitialState().editingRoundId,
    );
    const [editingScores, setEditingScores] = useState<string[]>(
        () => loadInitialState().editingScores,
    );

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                players,
                rounds,
                currentRound,
            }),
        );
    }, [players, rounds, currentRound]);

    const handlePlayerNameChange = (id: number, value: string) => {
        setPlayers((prev) =>
            prev.map((player) =>
                player.id === id ? { ...player, name: value } : player,
            ),
        );
    };

    const handlePlayerNameBlur = (id: number, index: number) => {
        setPlayers((prev) =>
            prev.map((player) =>
                player.id === id && player.name.trim() === ""
                    ? { ...player, name: `Người chơi ${index + 1}` }
                    : player,
            ),
        );
    };

    const handleScoreChange = (index: number, value: string) => {
        if (!/^-?\d*$/.test(value)) {
            return;
        }

        setCurrentRound((prev) =>
            prev.map((score, scoreIndex) =>
                scoreIndex === index ? value : score,
            ),
        );
    };

    const handleEditingScoreChange = (index: number, value: string) => {
        if (!/^-?\d*$/.test(value)) {
            return;
        }

        setEditingScores((prev) =>
            prev.map((score, scoreIndex) =>
                scoreIndex === index ? value : score,
            ),
        );
    };

    const addPlayer = () => {
        setPlayers((prev) => {
            if (prev.length >= MAX_PLAYERS) {
                return prev;
            }

            return [
                ...prev,
                {
                    id: Date.now() + Math.random(),
                    name: `Người chơi ${prev.length + 1}`,
                },
            ];
        });

        setCurrentRound((prev) => [...prev, ""]);
        setRounds((prev) =>
            prev.map((round) => ({ ...round, scores: [...round.scores, 0] })),
        );

        if (editingRoundId) {
            setEditingScores((prev) => [...prev, "0"]);
        }
    };

    const removePlayer = (playerId: number) => {
        if (players.length <= MIN_PLAYERS) {
            return;
        }

        const removeIndex = players.findIndex(
            (player) => player.id === playerId,
        );
        if (removeIndex === -1) {
            return;
        }

        setPlayers((prev) => prev.filter((player) => player.id !== playerId));
        setCurrentRound((prev) =>
            prev.filter((_, index) => index !== removeIndex),
        );
        setRounds((prev) =>
            prev.map((round) => ({
                ...round,
                scores: round.scores.filter(
                    (_, index) => index !== removeIndex,
                ),
            })),
        );

        if (editingRoundId) {
            setEditingScores((prev) =>
                prev.filter((_, index) => index !== removeIndex),
            );
        }
    };

    const addRound = () => {
        const newRound: Round = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            scores: currentRound.map(normalizeScore),
        };

        setRounds((prev) => [...prev, newRound]);
        setCurrentRound(createEmptyRoundInput(players.length));
    };

    const startEditRound = (round: Round) => {
        setEditingRoundId(round.id);
        setEditingScores(round.scores.map((score) => String(score)));
    };

    const cancelEditRound = () => {
        setEditingRoundId(null);
        setEditingScores([]);
    };

    const saveEditRound = (roundId: string) => {
        setRounds((prev) =>
            prev.map((round) =>
                round.id === roundId
                    ? {
                          ...round,
                          scores: editingScores.map(normalizeScore),
                      }
                    : round,
            ),
        );

        cancelEditRound();
    };

    const removeRound = (roundId: string) => {
        setRounds((prev) => prev.filter((round) => round.id !== roundId));

        if (editingRoundId === roundId) {
            cancelEditRound();
        }
    };

    const resetAll = () => {
        const initial = createInitialState();
        setPlayers(initial.players);
        setRounds(initial.rounds);
        setCurrentRound(initial.currentRound);
        setEditingRoundId(initial.editingRoundId);
        setEditingScores(initial.editingScores);

        if (typeof window !== "undefined") {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    };

    const { totals, cumulativeByRound, ranking } = useMemo(
        () => buildDerivedData(rounds, players),
        [rounds, players],
    );

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 text-foreground transition-colors overflow-hidden relative">
            {/* Background decorations for a bit of dynamic dynamic feel */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

            <div className="mx-auto max-w-7xl space-y-6 relative z-10">
                <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Tính điểm nhiều người chơi
                            </CardTitle>
                            <CardDescription className="mt-2 text-muted-foreground max-w-xl">
                                Tự lưu dữ liệu mượt mà, hỗ trợ giao diện tối,
                                thêm bớt người chơi linh hoạt nhanh chóng tiện
                                lợi.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button
                                onClick={resetAll}
                                variant="outline"
                                className="gap-2 shrink-0"
                            >
                                <RotateCcw className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Đặt lại tất cả
                                </span>
                                <span className="sm:hidden">Đặt lại</span>
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2 min-w-0">
                        {/* Player Management */}
                        <Card className="shadow-sm bg-card/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xl font-semibold">
                                    Quản lý Người chơi
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                                        {players.length} / {MAX_PLAYERS}
                                    </div>
                                    <Button
                                        onClick={addPlayer}
                                        disabled={players.length >= MAX_PLAYERS}
                                        size="sm"
                                        className="gap-1 shadow-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Thêm người chơi
                                        </span>
                                        <span className="sm:hidden">Thêm</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {players.map((player, index) => (
                                        <div
                                            key={player.id}
                                            className="rounded-xl border bg-background/50 p-4 space-y-3 relative group transition-all hover:border-primary/30 hover:shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <Label
                                                    htmlFor={`player-${player.id}`}
                                                    className="font-medium text-xs uppercase tracking-wider text-muted-foreground"
                                                >
                                                    Người chơi {index + 1}
                                                </Label>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removePlayer(player.id)
                                                    }
                                                    disabled={
                                                        players.length <=
                                                        MIN_PLAYERS
                                                    }
                                                    className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Input
                                                id={`player-${player.id}`}
                                                type="text"
                                                value={player.name}
                                                onChange={(e) =>
                                                    handlePlayerNameChange(
                                                        player.id,
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={() =>
                                                    handlePlayerNameBlur(
                                                        player.id,
                                                        index,
                                                    )
                                                }
                                                className="bg-background focus-visible:ring-primary/20"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Input New Round */}
                        <Card className="shadow-sm border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-primary">
                                    Nhập điểm cho lượt mới
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {players.map((player, index) => (
                                        <div
                                            key={`input-${player.id}`}
                                            className="space-y-2"
                                        >
                                            <Label
                                                htmlFor={`score-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                {player.name}
                                            </Label>
                                            <Input
                                                id={`score-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                value={
                                                    currentRound[index] ?? ""
                                                }
                                                onChange={(e) =>
                                                    handleScoreChange(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="0"
                                                className="text-lg font-semibold h-12 bg-background border-primary/10 shadow-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={addRound}
                                    className="w-full sm:w-auto mt-2 h-11 px-8 text-base shadow-md hover:shadow-lg transition-all"
                                    size="lg"
                                >
                                    <Check className="h-5 w-5 mr-2" />
                                    Xác nhận Thêm lượt
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* History Table */}
                        <Card className="shadow-sm bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    Lịch sử điểm từng lượt
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 sm:px-6 sm:pb-6">
                                <div className="w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-b-border/60">
                                                <TableHead className="w-[80px]">
                                                    Lượt
                                                </TableHead>
                                                {players.map((player) => (
                                                    <TableHead
                                                        key={`th-${player.id}`}
                                                        className="min-w-[100px]"
                                                    >
                                                        {player.name}
                                                    </TableHead>
                                                ))}
                                                <TableHead className="w-[120px] text-right">
                                                    Thao tác
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rounds.length === 0 ? (
                                                <TableRow className="hover:bg-transparent">
                                                    <TableCell
                                                        colSpan={
                                                            players.length + 2
                                                        }
                                                        className="h-32 text-center text-muted-foreground border-b-0"
                                                    >
                                                        Chưa có lượt nào được
                                                        thêm. Hãy bắt đầu bằng
                                                        cách nhập điểm!
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                rounds.map((round, index) => {
                                                    const isEditing =
                                                        editingRoundId ===
                                                        round.id;
                                                    return (
                                                        <TableRow
                                                            key={round.id}
                                                            className={`${isEditing ? "bg-muted/40" : ""} transition-colors hover:bg-muted/20 border-b-border/60`}
                                                        >
                                                            <TableCell className="font-medium text-muted-foreground">
                                                                #{index + 1}
                                                            </TableCell>
                                                            {players.map(
                                                                (
                                                                    player,
                                                                    scoreIndex,
                                                                ) => (
                                                                    <TableCell
                                                                        key={`td-${round.id}-${player.id}`}
                                                                    >
                                                                        {isEditing ? (
                                                                            <Input
                                                                                type="text"
                                                                                inputMode="numeric"
                                                                                value={
                                                                                    editingScores[
                                                                                        scoreIndex
                                                                                    ] ??
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    handleEditingScoreChange(
                                                                                        scoreIndex,
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                                className="w-20 sm:w-24 h-9 font-medium"
                                                                            />
                                                                        ) : (
                                                                            <span className="font-medium">
                                                                                {
                                                                                    round
                                                                                        .scores[
                                                                                        scoreIndex
                                                                                    ]
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                ),
                                                            )}
                                                            <TableCell className="text-right">
                                                                {isEditing ? (
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <Button
                                                                            size="icon"
                                                                            variant="default"
                                                                            className="h-8 w-8 shadow-sm"
                                                                            onClick={() =>
                                                                                saveEditRound(
                                                                                    round.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Check className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            className="h-8 w-8"
                                                                            onClick={
                                                                                cancelEditRound
                                                                            }
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 opacity-60 hover:opacity-100 transition-opacity"
                                                                            onClick={() =>
                                                                                startEditRound(
                                                                                    round,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 opacity-60 text-destructive/90 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                                                                            onClick={() =>
                                                                                removeRound(
                                                                                    round.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cumulative Table */}
                        <Card className="shadow-sm bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    Lịch sử điểm cộng dồn
                                </CardTitle>
                                <CardDescription>
                                    Tiến trình điểm số sau mỗi vòng
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 sm:px-6 sm:pb-6">
                                <div className="w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-b-border/60">
                                                <TableHead className="w-[80px]">
                                                    Lượt
                                                </TableHead>
                                                {players.map((player) => (
                                                    <TableHead
                                                        key={`cth-${player.id}`}
                                                        className="min-w-[100px]"
                                                    >
                                                        {player.name}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cumulativeByRound.length === 0 ? (
                                                <TableRow className="hover:bg-transparent">
                                                    <TableCell
                                                        colSpan={
                                                            players.length + 1
                                                        }
                                                        className="h-32 text-center text-muted-foreground border-b-0"
                                                    >
                                                        Chưa có dữ liệu cộng
                                                        dồn.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                cumulativeByRound.map((row) => (
                                                    <TableRow
                                                        key={`cum-${row.id}`}
                                                        className="hover:bg-muted/10 transition-colors border-b-border/60"
                                                    >
                                                        <TableCell className="font-medium text-muted-foreground">
                                                            #{row.roundNumber}
                                                        </TableCell>
                                                        {row.totals.map(
                                                            (
                                                                score,
                                                                scoreIndex,
                                                            ) => (
                                                                <TableCell
                                                                    key={`ctd-${row.id}-${scoreIndex}`}
                                                                    className="font-medium"
                                                                >
                                                                    {score}
                                                                </TableCell>
                                                            ),
                                                        )}
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6 min-w-0">
                        <Card className="shadow-md border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold">
                                    Điểm số hiện tại
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {players.map((player, index) => (
                                    <div
                                        key={`final-${player.id}`}
                                        className="group flex items-center justify-between p-4 rounded-xl bg-background border shadow-sm transition-all hover:border-primary/30"
                                    >
                                        <span className="font-medium text-foreground/90">
                                            {player.name}
                                        </span>
                                        <span className="text-2xl font-black tracking-tight text-primary">
                                            {totals[index] || 0}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold">
                                    Bảng Xếp Hạng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {ranking.map((item, index) => (
                                    <div
                                        key={`rank-${item.id}`}
                                        className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 transition-colors hover:bg-muted/60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm ${
                                                    index === 0
                                                        ? "bg-yellow-400 text-yellow-950 dark:bg-yellow-500/20 dark:text-yellow-500"
                                                        : index === 1
                                                          ? "bg-slate-200 text-slate-700 dark:bg-slate-400/20 dark:text-slate-300"
                                                          : index === 2
                                                            ? "bg-orange-200 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400"
                                                            : "bg-background border text-muted-foreground"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div
                                                className={`font-semibold ${index === 0 ? "text-foreground" : "text-foreground/80"}`}
                                            >
                                                {item.name}
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold">
                                            {item.score}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold">
                                    Hướng dẫn sử dụng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5 text-sm text-muted-foreground list-none pl-0">
                                    <li className="flex gap-2">
                                        <span className="text-primary mt-0.5">
                                            •
                                        </span>
                                        <span>
                                            Tên người chơi, điểm đã nhập đều tự
                                            động lưu bằng{" "}
                                            <strong>localStorage</strong>.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary mt-0.5">
                                            •
                                        </span>
                                        <span>
                                            Thêm hoặc xóa người chơi linh hoạt
                                            trong suốt quá trình.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary mt-0.5">
                                            •
                                        </span>
                                        <span>
                                            Sửa điểm một vòng bất kỳ sẽ lập tức
                                            cập nhật lại Bảng xếp hạng và Điểm
                                            tổng.
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
