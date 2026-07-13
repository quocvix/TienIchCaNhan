export type Rank = "NHẤT" | "NHÌ" | "BA" | "BÉT";

export interface ScoreDrawerProps {
    players: string[];
    onConfirm: (scores: Record<string, number>, details?: any) => void;
    onDelete?: () => void;
    initialData?: {
        ranks?: Record<string, Rank | null>;
        anHeoSelection?: Record<string, { do: number; den: number }>;
        phatHeoSelection?: Record<string, { do: number; den: number }>;
        chetHeoSelection?: Record<string, { do: number; den: number }>;
        chetChaySelection?: Record<string, "an" | "chay" | "">;
        doiThongSelection?: Record<string, { an: number; phat: number }>;
    };
    roundNumber?: number;
}
