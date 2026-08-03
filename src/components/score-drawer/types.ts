import type { Player } from "@/types";

export type { Player };
export type Rank = "NHẤT" | "NHÌ" | "BA" | "BÉT";

export interface ChatEvent {
    id: string;
    heoDo: number;
    heoDen: number;
    doiThong: number;
    sequence: string[]; // [pInitial, pCutter1, pCutter2, ...]
}

export interface ScoreDrawerProps {
    players: Player[];
    onConfirm: (scores: Record<string, number>, details?: any) => void;
    onDelete?: () => void;
    initialData?: {
        ranks?: Record<string, Rank | null>;
        anHeoSelection?: Record<string, { do: number; den: number }>;
        phatHeoSelection?: Record<string, { do: number; den: number }>;
        chetHeoSelection?: Record<string, { do: number; den: number }>;
        chetChaySelection?: Record<string, "an" | "chay" | "">;
        doiThongSelection?: Record<string, { an: number; phat: number }>;
        chatEvents?: ChatEvent[];
    };
    roundNumber?: number;
}
