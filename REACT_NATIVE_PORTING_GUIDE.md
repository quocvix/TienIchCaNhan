# HƯỚNG DẪN KỸ THUẬT: PORTING 100% SANG REACT NATIVE (PRODUCTION-READY BLUEPRINT)
> **Tài liệu dành cho:** AI Coding Agent / Senior React Native Developer  
> **Dự án nguồn:** Tiện Ích Đánh Bài (Tiến Lên Pro - Sổ Ghi Điểm)  
> **Mục tiêu:** Xây dựng một ứng dụng React Native (Expo SDK 52+ / Bare React Native) hoàn chỉnh, độc lập, có thể chạy ngay lập tức (Zero-guesswork, Plug-and-Play) với đầy đủ UI Midnight Casino, Core Scoring Engine, State Management và Storage.

---

## MỤC LỤC
1. [Cấu Trúc Thư Mục Chuẩn (Project Tree)](#1-cấu-trúc-thư-mục-chuẩn-project-tree)
2. [Cài Đặt & Cấu Hình Gốc (Dependencies, Babel, Root App)](#2-cài-đặt--cấu-hình-gốc-dependencies-babel-root-app)
3. [Design System & Theme Tokens (Midnight Casino)](#3-design-system--theme-tokens-midnight-casino)
4. [Data Models & Types (`src/types/game.ts`)](#4-data-models--types-srctypesgamets)
5. [Core Business Logic Engine (`src/logic/scoringEngine.ts`)](#5-core-business-logic-engine-srclogicscoringenginets)
6. [Tầng Lưu Trữ Dữ Liệu (`src/services/storage.ts` - MMKV)](#6-tầng-lưu-trữ-dữ-liệu-srcservicesstoragets---mmkv)
7. [State Management Hook (`src/hooks/useScoreState.ts`)](#7-state-management-hook-srchooksusescorestatets)
8. [Màn Hình 1: `src/screens/HomeScreen.tsx` (Kèm Ẩn/Hiện Điểm)](#8-màn-hình-1-srcscreenshomescreentsx-kèm-ẩnhiện-điểm)
9. [Màn Hình 2: `src/screens/GameRoomScreen.tsx` (Bục Danh Dự Sticky)](#9-màn-hình-2-srcscreensgameroomscreentsx-bục-danh-dự-sticky)
10. [Hệ Thống Bottom Sheet & Các Panel Ghi Điểm Chi Tiết](#10-hệ-thống-bottom-sheet--các-panel-ghi-điểm-chi-tiết)
    - 10.1. `src/components/sheets/AppBottomSheet.tsx` (Khung Bottom Sheet chuẩn)
    - 10.2. `src/components/sheets/CreateGameBottomSheet.tsx` (Presets Tiêu chuẩn / Nhất ăn tất)
    - 10.3. `src/components/sheets/AddPlayerBottomSheet.tsx` (Điền nhanh Bắc-Trung-Nam-Tây)
    - 10.4. `src/components/sheets/ReportBottomSheet.tsx` (Báo cáo tổng kết bàn đấu)
    - 10.5. `src/components/sheets/ScoreBottomSheet.tsx` (Modal ghi điểm đa tab)
    - 10.6. `src/components/score-panels/RankSelection.tsx` (Huy chương 2x2 🥇🥈🥉💀)
    - 10.7. `src/components/score-panels/AnPhatHeoPanel.tsx` (Ăn / Phạt heo đỏ & đen)
    - 10.8. `src/components/score-panels/ChetHeoPanel.tsx` (Thối heo khi về bét)
    - 10.9. `src/components/score-panels/ChetChayPanel.tsx` (Cháy bài / Cóng & Ăn cóng)
    - 10.10. `src/components/score-panels/ChantDePanel.tsx` (Chặt đè luỹ thừa 2^(len-2))
    - 10.11. `src/components/score-panels/ScoreSummary.tsx` (Bảng tổng kết điểm ván)
11. [Checklist Kiểm Thử & Tối Ưu Hiệu Năng](#11-checklist-kiểm-thử--tối-ưu-hiệu-năng)

---

## 1. CẤU TRÚC THƯ MỤC CHUẨN (PROJECT TREE)

```text
TienIchDanhBai/
├── App.tsx                                 # Root component (GestureHandlerRootView + Navigation)
├── babel.config.js                         # Cấu hình plugin Reanimated
├── package.json
└── src/
    ├── types/
    │   └── game.ts                         # Toàn bộ TypeScript interfaces & types
    ├── theme.ts                            # Design tokens màu sắc Midnight Casino
    ├── logic/
    │   └── scoringEngine.ts                # Pure functions tính toán điểm số độc lập
    ├── services/
    │   └── storage.ts                      # Tầng lưu trữ MMKV (Sync & Offline-first)
    ├── hooks/
    │   └── useScoreState.ts                # Custom hook điều khiển toàn bộ logic ván bài
    ├── screens/
    │   ├── HomeScreen.tsx                  # Danh sách bàn chơi, nút Tạo ván, Ẩn/Hiện điểm
    │   └── GameRoomScreen.tsx              # Bàn đấu: Sticky Podium, danh sách ván, nút ghi điểm
    └── components/
        ├── sheets/
        │   ├── AppBottomSheet.tsx          # Wrapper chuẩn cho @gorhom/bottom-sheet
        │   ├── CreateGameBottomSheet.tsx   # Sheet tạo bàn chơi mới
        │   ├── AddPlayerBottomSheet.tsx    # Sheet nhập & điền nhanh tên người chơi
        │   ├── ReportBottomSheet.tsx       # Sheet báo cáo tổng kết & xếp hạng
        │   └── ScoreBottomSheet.tsx        # Sheet ghi điểm ván đấu chính
        └── score-panels/
            ├── RankSelection.tsx           # Thẻ chọn hạng Nhất/Nhì/Ba/Bét 2x2
            ├── AnPhatHeoPanel.tsx          # Tab Ăn Heo & Phạt Heo
            ├── ChetHeoPanel.tsx            # Tab Thối Heo
            ├── ChetChayPanel.tsx           # Tab Cháy bài (Cóng)
            ├── ChantDePanel.tsx            # Tab Chặt Đè (Cut Stacking)
            └── ScoreSummary.tsx            # Tóm tắt chi tiết điểm số ván hiện tại
```

---

## 2. CÀI ĐẶT & CẤU HÌNH GỐC (DEPENDENCIES, BABEL, ROOT APP)

### 2.1. Cài đặt thư viện
```bash
# 1. Tạo project Expo
npx create-expo-app@latest TienIchDanhBai --template blank-typescript
cd TienIchDanhBai

# 2. Cài đặt navigation & core UI
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

# 3. Cài đặt BottomSheet & Animations (Bắt buộc cho kéo trượt 120 FPS)
npx expo install @gorhom/bottom-sheet react-native-gesture-handler react-native-reanimated

# 4. Storage, Icons & Haptics
npx expo install react-native-mmkv lucide-react-native react-native-svg expo-haptics
```

### 2.2. `babel.config.js`
> **Lưu ý sống còn:** Plugin `react-native-reanimated/plugin` **phải luôn nằm ở cuối cùng** của mảng `plugins`.

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

### 2.3. Root `App.tsx`
> **Lưu ý sống còn:** Phải bọc `<GestureHandlerRootView style={{ flex: 1 }}>` ở ngoài cùng, nếu không BottomSheet sẽ bị treo gesture hoặc crash app.

```tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import GameRoomScreen from './src/screens/GameRoomScreen';
import { PALETTE } from './src/theme';

export type RootStackParamList = {
  Home: undefined;
  GameRoom: { gameId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: PALETTE.bgApp }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={PALETTE.bgHeader} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: PALETTE.bgApp },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="GameRoom" component={GameRoomScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 3. DESIGN SYSTEM & THEME TOKENS (MIDNIGHT CASINO)

Đặt tại: `src/theme.ts`

```typescript
export const PALETTE = {
  // Backgrounds
  bgApp: "#07090E",          // Nền sâu thẳm toàn màn hình
  bgHeader: "#0B0F19",       // Nền top navbar & sticky podium
  bgCard: "#111624",         // Nền card bàn chơi
  bgCardSubtle: "#141824",   // Nền item người chơi, button phụ
  bgSheet: "#0c101b",        // Nền bottom sheet modal
  bgSheetHeader: "#0f1422",  // Nền header của sheet

  // Borders
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderMedium: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.15)",

  // Brand Accents
  brandRed: "#d60000",
  brandRedDark: "#8b0000",
  brandEmerald: "#10b981",
  brandRose: "#f43f5e",
  brandAmber: "#f59e0b",
  brandBlue: "#3b82f6",
};
```

---

## 4. DATA MODELS & TYPES (`src/types/game.ts`)

```typescript
export interface Player {
  id: string;
  name: string;
}

export type Rank = "NHẤT" | "NHÌ" | "BA" | "BÉT";

export interface GamePenalties {
  heoDo: number;       // Phạt chặt heo đỏ (mặc định: 4)
  heoDen: number;      // Phạt chặt heo đen (mặc định: 2)
  chetHeoDo: number;   // Thối heo đỏ (mặc định: 4)
  chetHeoDen: number;  // Thối heo đen (mặc định: 2)
  chetChay: number;    // Chết cháy / Cóng bài (mặc định: 4)
  doiThong?: number;   // Đôi thông (mặc định: 4)
}

export interface GameSettings {
  preset?: "standard" | "nhat_an_tat";
  nhat: number;        // Điểm về nhất (4 hoặc 1)
  nhi: number;         // Điểm về nhì (3 hoặc 0)
  ba: number;          // Điểm về ba (2 hoặc 0)
  bet: number;         // Điểm về bét (1 hoặc 0)
  penalties: GamePenalties;
}

export interface ChatEvent {
  id: string;
  heoDo: number;       // Số heo đỏ bị chặt
  heoDen: number;      // Số heo đen bị chặt
  doiThong: number;    // Số đôi thông
  sequence: string[];  // ID người chơi tham gia: [pBiChat, pChat1, pChat2, ...]
}

export interface RoundDetail {
  ranks?: Record<string, Rank | null>;
  anHeoSelection?: Record<string, { do: number; den: number }>;
  phatHeoSelection?: Record<string, { do: number; den: number }>;
  chetHeoSelection?: Record<string, { do: number; den: number }>;
  chetChaySelection?: Record<string, "an" | "chay" | "">;
  chatEvents?: ChatEvent[];
}

export interface GameRound {
  scores: Record<string, number>; // { [playerId]: score }
  details?: RoundDetail;
}

export interface GameSession {
  id: string;
  time: string;
  players: Player[];
  history: GameRound[];
  settings: GameSettings;
}
```

---

## 5. CORE BUSINESS LOGIC ENGINE (`src/logic/scoringEngine.ts`)

Toàn bộ thuật toán tính điểm là Pure Functions, 100% platform-agnostic, sẵn sàng chạy test tự động.

```typescript
import { ChatEvent, GameSettings, Rank, RoundDetail } from "../types/game";

/**
 * 1. Thuật toán Chặt Đè (Cut Stacking)
 * - Nếu len = 2 (chặt đơn): p0 bị phạt, p1 được ăn
 * - Nếu len >= 3 (chặt đè): p0 thoát (0đ),
 *   người áp chót p(len-2) bị phạt gấp bội: basePoints * 2^(len-2)
 *   người chặt thắng cuối cùng p(len-1) ăn trọn số điểm đó.
 */
export function calculateEventScores(
  event: ChatEvent,
  heoValues: { do: number; den: number },
  _doiThongPenalty: number = 0
): Record<string, number> {
  const scores: Record<string, number> = {};
  const basePoints = (event.heoDo || 0) * heoValues.do + (event.heoDen || 0) * heoValues.den;

  if (basePoints <= 0 || event.sequence.length < 2) {
    return scores;
  }

  const len = event.sequence.length;

  if (len === 2) {
    const victim = event.sequence[0];
    const winner = event.sequence[1];
    if (victim) scores[victim] = (scores[victim] || 0) - basePoints;
    if (winner) scores[winner] = (scores[winner] || 0) + basePoints;
  } else {
    const multiplier = Math.pow(2, len - 2);
    const finalPoints = basePoints * multiplier;

    const victim = event.sequence[len - 2];
    const winner = event.sequence[len - 1];

    if (victim) scores[victim] = (scores[victim] || 0) - finalPoints;
    if (winner) scores[winner] = (scores[winner] || 0) + finalPoints;
  }

  return scores;
}

/**
 * 2. Lấy điểm thứ hạng về đích
 */
export function getScoreForRank(rank: Rank | null, settings?: GameSettings): number {
  if (!rank) return 0;
  const nhat = settings?.nhat ?? 4;
  const nhi = settings?.nhi ?? 3;
  const ba = settings?.ba ?? 2;
  const bet = settings?.bet ?? 1;

  switch (rank) {
    case "NHẤT": return nhat;
    case "NHÌ": return nhi;
    case "BA": return ba;
    case "BÉT": return bet;
    default: return 0;
  }
}

/**
 * 3. Tính tổng điểm của một người chơi trong một ván đấu
 */
export function calculatePlayerScore(
  playerId: string,
  roundData: RoundDetail,
  settings: GameSettings,
  allPlayerIds: string[]
): number {
  let score = 0;
  const chetChay = roundData.chetChaySelection?.[playerId] || "";
  const isBurned = chetChay === "chay";
  const isEater = chetChay === "an";
  const chetChayPenalty = settings.penalties?.chetChay ?? 4;

  const burnedCount = allPlayerIds.filter(
    (id) => roundData.chetChaySelection?.[id] === "chay"
  ).length;

  // A. Thứ hạng hoặc Phạt Cháy bài (Cóng)
  if (isBurned) {
    score -= chetChayPenalty;
  } else {
    const rank = roundData.ranks?.[playerId] || null;
    score += getScoreForRank(rank, settings);
  }

  // B. Người ăn cóng: ăn trọn số tiền phạt của tất cả người bị cóng
  if (isEater) {
    score += chetChayPenalty * burnedCount;
  }

  // C. Ăn Heo / Phạt Heo (Legacy & vãng lai)
  const heoValues = {
    do: settings.penalties?.heoDo ?? 4,
    den: settings.penalties?.heoDen ?? 2,
  };

  const anHeo = roundData.anHeoSelection?.[playerId];
  if (anHeo) {
    score += heoValues.do * (anHeo.do || 0);
    score += heoValues.den * (anHeo.den || 0);
  }

  const phatHeo = roundData.phatHeoSelection?.[playerId];
  if (phatHeo) {
    score -= heoValues.do * (phatHeo.do || 0);
    score -= heoValues.den * (phatHeo.den || 0);
  }

  // D. Chết Heo (Thối heo khi kết thúc ván)
  const chetHeoValues = {
    do: settings.penalties?.chetHeoDo ?? 4,
    den: settings.penalties?.chetHeoDen ?? 2,
  };
  const chetHeo = roundData.chetHeoSelection?.[playerId];
  if (chetHeo) {
    score -= chetHeoValues.do * (chetHeo.do || 0);
    score -= chetHeoValues.den * (chetHeo.den || 0);
  }

  // E. Chặt Đè (Cut Stacking)
  const dtValue = settings.penalties?.doiThong ?? 4;
  (roundData.chatEvents || []).forEach((ev) => {
    const evScores = calculateEventScores(ev, heoValues, dtValue);
    score += evScores[playerId] || 0;
  });

  return score;
}

/**
 * 4. Kiểm tra ván đấu đã hợp lệ để lưu chưa
 * Điều kiện: Tất cả người chơi KHÔNG BỊ CÓNG đều phải được chọn thứ hạng
 */
export function isRoundValidToSave(
  playerIds: string[],
  ranks: Record<string, Rank | null>,
  chetChaySelection: Record<string, "an" | "chay" | "">
): boolean {
  const activePlayerIds = playerIds.filter(
    (id) => chetChaySelection[id] !== "chay"
  );
  if (activePlayerIds.length === 0) return false;
  return activePlayerIds.every((id) => Boolean(ranks[id]));
}
```

---

## 6. TẦNG LƯU TRỮ DỮ LIỆU (`src/services/storage.ts` - MMKV)

```typescript
import { MMKV } from "react-native-mmkv";
import { GameSession } from "../types/game";

const storage = new MMKV();
const GAME_HISTORY_KEY = "game_history";
const REVEALED_GAMES_KEY = "revealed_games";

export const GameStorage = {
  getAllGames(): GameSession[] {
    try {
      const raw = storage.getString(GAME_HISTORY_KEY);
      if (!raw) return [];
      const games = JSON.parse(raw);
      return games.map((g: any) => ({
        ...g,
        players: (g.players || []).map((p: any) =>
          typeof p === "string" ? { id: p, name: p } : p
        ),
      }));
    } catch (error) {
      console.error("Lỗi đọc game history:", error);
      return [];
    }
  },

  getGameById(id: string): GameSession | null {
    const games = this.getAllGames();
    return games.find((g) => g.id === id) || null;
  },

  saveAllGames(games: GameSession[]): void {
    try {
      storage.set(GAME_HISTORY_KEY, JSON.stringify(games));
    } catch (error) {
      console.error("Lỗi lưu game history:", error);
    }
  },

  saveGame(game: GameSession): void {
    const games = this.getAllGames();
    const index = games.findIndex((g) => g.id === game.id);
    if (index >= 0) {
      games[index] = game;
    } else {
      games.unshift(game);
    }
    this.saveAllGames(games);
  },

  deleteGame(id: string): void {
    const games = this.getAllGames().filter((g) => g.id !== id);
    this.saveAllGames(games);
  },

  getRevealedGames(): Record<string, boolean> {
    try {
      const raw = storage.getString(REVEALED_GAMES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveRevealedGames(revealed: Record<string, boolean>): void {
    storage.set(REVEALED_GAMES_KEY, JSON.stringify(revealed));
  },
};
```

---

## 7. STATE MANAGEMENT HOOK (`src/hooks/useScoreState.ts`)

```typescript
import { useState, useMemo } from "react";
import { Player, Rank, ChatEvent, RoundDetail, GameSettings } from "../types/game";
import { calculatePlayerScore, isRoundValidToSave } from "../logic/scoringEngine";

interface UseScoreStateProps {
  players: Player[];
  settings: GameSettings;
  initialData?: RoundDetail;
  onConfirm: (scores: Record<string, number>, details: RoundDetail) => void;
}

export function useScoreState({
  players,
  settings,
  initialData,
  onConfirm,
}: UseScoreStateProps) {
  const [ranks, setRanks] = useState<Record<string, Rank | null>>(
    initialData?.ranks || {}
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
    initialData?.chatEvents || []
  );

  const isPlayerBurned = (id: string) => chetChaySelection[id] === "chay";
  const isPlayerEater = (id: string) => chetChaySelection[id] === "an";
  const burnedCount = useMemo(
    () => players.filter((p) => isPlayerBurned(p.id)).length,
    [players, chetChaySelection]
  );

  // Chọn thứ tự về đích: Nhất -> Nhì -> Ba -> Bét
  const handlePlayerRankClick = (id: string) => {
    if (isPlayerBurned(id)) return;

    const rankOrder: Rank[] = ["NHẤT", "NHÌ", "BA", "BÉT"];
    if (ranks[id]) {
      const next = { ...ranks };
      delete next[id];
      setRanks(next);
    } else {
      const assigned = Object.values(ranks).filter(Boolean) as Rank[];
      const nextAvailable = rankOrder.find((r) => !assigned.includes(r));
      if (nextAvailable) {
        setRanks({ ...ranks, [id]: nextAvailable });
      }
    }
  };

  // Toggle Heo: 0 -> 1 -> 2 -> 0
  const toggleHeo = (
    id: string,
    color: "do" | "den",
    type: "an" | "phat" | "chet"
  ) => {
    const selectionMap = {
      an: [anHeoSelection, setAnHeoSelection] as const,
      phat: [phatHeoSelection, setPhatHeoSelection] as const,
      chet: [chetHeoSelection, setChetHeoSelection] as const,
    };
    const [targetSelection, setTargetSelection] = selectionMap[type];
    const current = targetSelection[id] || { do: 0, den: 0 };
    const currentVal = current[color];
    const nextVal = currentVal === 0 ? 1 : currentVal === 1 ? 2 : 0;

    setTargetSelection({
      ...targetSelection,
      [id]: { ...current, [color]: nextVal },
    });
  };

  const clearHeo = (id: string, type: "an" | "phat" | "chet") => {
    if (type === "an") setAnHeoSelection({ ...anHeoSelection, [id]: { do: 0, den: 0 } });
    if (type === "phat") setPhatHeoSelection({ ...phatHeoSelection, [id]: { do: 0, den: 0 } });
    if (type === "chet") setChetHeoSelection({ ...chetHeoSelection, [id]: { do: 0, den: 0 } });
  };

  const clearChetChay = (id: string) => {
    setChetChaySelection({ ...chetChaySelection, [id]: "" });
  };

  // Chặt đè events
  const addChatEvent = () => {
    const defaultSeq = players.length >= 2 ? [players[0].id, players[1].id] : [];
    setChatEvents([
      ...chatEvents,
      {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
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

  const getScore = (id: string) => {
    const roundData: RoundDetail = {
      ranks,
      anHeoSelection,
      phatHeoSelection,
      chetHeoSelection,
      chetChaySelection,
      chatEvents,
    };
    return calculatePlayerScore(
      id,
      roundData,
      settings,
      players.map((p) => p.id)
    );
  };

  const allRanked = useMemo(
    () => isRoundValidToSave(players.map((p) => p.id), ranks, chetChaySelection),
    [players, ranks, chetChaySelection]
  );

  const handleConfirm = () => {
    if (!allRanked) return;
    const scores: Record<string, number> = {};
    players.forEach((p) => {
      scores[p.id] = getScore(p.id);
    });

    const details: RoundDetail = {
      ranks,
      anHeoSelection,
      phatHeoSelection,
      chetHeoSelection,
      chetChaySelection,
      chatEvents,
    };

    onConfirm(scores, details);
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
    isPlayerBurned,
    isPlayerEater,
    burnedCount,
    handlePlayerRankClick,
    toggleHeo,
    clearHeo,
    clearChetChay,
    getScore,
    allRanked,
    handleConfirm,
  };
}
```

---

## 8. MÀN HÌNH 1: `src/screens/HomeScreen.tsx` (KÈM ẨN/HIỆN ĐIỂM)

Đã có sẵn trong Section 8.1 ở phiên bản trước. Màn hình quản lý:
- Brand Header "TIẾN LÊN PRO APP"
- Nút "Tạo Ván Mới" gradient đỏ
- Danh sách ván bài kèm nút toggle **Eye / EyeOff (Ẩn / Hiện điểm)**
- Vương miện 👑 người dẫn đầu bàn chơi.

---

## 9. MÀN HÌNH 2: `src/screens/GameRoomScreen.tsx` (BỤC DANH DỰ STICKY)

Đã có sẵn trong Section 8.2 ở phiên bản trước. Màn hình quản lý:
- Header sticky với **Podium Bục Danh Dự**
- Card ván bài dạng bo cong `V1, V2...`
- Nút xác nhận `Alert.alert` khi mở Báo Cáo Tổng Kết hoặc Reset
- Nút cố định đáy màn hình `GHI ĐIỂM VÁN {roundCount + 1}`.

---

## 10. HỆ THỐNG BOTTOM SHEET & CÁC PANEL GHI ĐIỂM CHI TIẾT

### 10.1. `src/components/sheets/AppBottomSheet.tsx`
Khung wrapper chuẩn bảo đảm BottomSheet hoạt động mượt mà:
```tsx
import React, { useRef, useMemo, useCallback } from "react";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { PALETTE } from "../../theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: string[];
  children: React.ReactNode;
}

export function AppBottomSheet({
  isOpen,
  onClose,
  snapPoints = ["85%", "92%"],
  children,
}: Props) {
  const ref = useRef<BottomSheet>(null);
  const snaps = useMemo(() => snapPoints, [snapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    []
  );

  if (!isOpen) return null;

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snaps}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: PALETTE.bgSheet }}
      handleIndicatorStyle={{ backgroundColor: "rgba(255,255,255,0.25)", width: 44, height: 5 }}
    >
      <BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
    </BottomSheet>
  );
}
```

### 10.2. `src/components/sheets/CreateGameBottomSheet.tsx` & 10.3. `AddPlayerBottomSheet.tsx`
(Đã định nghĩa đầy đủ trong Section 8.4 và 8.5).

### 10.4. `src/components/sheets/ReportBottomSheet.tsx` (Báo Cáo Tổng Kết Bàn Đấu)
```tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Trophy, X } from "lucide-react-native";
import { AppBottomSheet } from "./AppBottomSheet";
import { Player, GameRound } from "../../types/game";
import { PALETTE } from "../../theme";

interface Props {
  isOpen: boolean;
  players: Player[];
  history: GameRound[];
  onClose: () => void;
}

export function ReportBottomSheet({ isOpen, players, history, onClose }: Props) {
  const getPlayerTotal = (playerId: string) => {
    return history.reduce((sum, round) => {
      const scores = round.scores || round;
      return sum + (scores[playerId] ?? 0);
    }, 0);
  };

  const rankedPlayers = [...players]
    .map((p) => ({ player: p, total: getPlayerTotal(p.id) }))
    .sort((a, b) => b.total - a.total);

  return (
    <AppBottomSheet isOpen={isOpen} onClose={onClose} snapPoints={["80%"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.trophyIcon}>
              <Trophy color="#f59e0b" size={20} />
            </View>
            <View>
              <Text style={styles.title}>Báo Cáo Tổng Kết Bàn</Text>
              <Text style={styles.subTitle}>Tổng {history.length} ván đấu đã qua</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X color="#9ca3af" size={18} />
          </TouchableOpacity>
        </View>

        {/* Podium Rankings List */}
        <ScrollView contentContainerStyle={styles.list}>
          {rankedPlayers.map(({ player, total }, idx) => {
            const isWinner = idx === 0 && total > 0;
            return (
              <View
                key={player.id}
                style={[styles.rankItem, isWinner && styles.winnerItem]}
              >
                <View style={styles.rankLeft}>
                  <View
                    style={[
                      styles.rankBadge,
                      idx === 0
                        ? styles.goldBadge
                        : idx === 1
                        ? styles.silverBadge
                        : idx === 2
                        ? styles.bronzeBadge
                        : styles.normalBadge,
                    ]}
                  >
                    <Text style={styles.rankBadgeText}>{idx + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.playerName}>
                      {player.name} {isWinner && "👑"}
                    </Text>
                    <Text style={styles.playerStatus}>
                      {isWinner ? "Đang dẫn đầu" : `Hạng ${idx + 1}`}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.totalScore,
                    total > 0 && styles.scoreGreen,
                    total < 0 && styles.scoreRed,
                  ]}
                >
                  {total > 0 ? `+${total}` : total}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
          <Text style={styles.doneBtnText}>ĐÓNG BÁO CÁO</Text>
        </TouchableOpacity>
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: PALETTE.borderMedium,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  trophyIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(245,158,11,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  subTitle: { color: "#9ca3af", fontSize: 11 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  list: { paddingVertical: 14, gap: 10 },
  rankItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PALETTE.bgCardSubtle,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  winnerItem: {
    borderColor: "rgba(245,158,11,0.35)",
    backgroundColor: "rgba(245,158,11,0.06)",
  },
  rankLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  goldBadge: { backgroundColor: "#f59e0b" },
  silverBadge: { backgroundColor: "#94a3b8" },
  bronzeBadge: { backgroundColor: "#ea580c" },
  normalBadge: { backgroundColor: "rgba(255,255,255,0.1)" },
  rankBadgeText: { fontWeight: "900", color: "#000000", fontSize: 14 },
  playerName: { color: "#ffffff", fontWeight: "bold", fontSize: 14, textTransform: "uppercase" },
  playerStatus: { color: "#9ca3af", fontSize: 11 },
  totalScore: { fontSize: 18, fontWeight: "900", fontFamily: "monospace", color: "#9ca3af" },
  scoreGreen: { color: PALETTE.brandEmerald },
  scoreRed: { color: PALETTE.brandRose },
  doneBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  doneBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
```

### 10.5. `src/components/sheets/ScoreBottomSheet.tsx` (Modal Ghi Điểm Đa Tab)
```tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Trophy, Pencil, X } from "lucide-react-native";
import { AppBottomSheet } from "./AppBottomSheet";
import { Player, GameSettings, RoundDetail } from "../../types/game";
import { useScoreState } from "../../hooks/useScoreState";
import { PALETTE } from "../../theme";

import RankSelection from "../score-panels/RankSelection";
import AnPhatHeoPanel from "../score-panels/AnPhatHeoPanel";
import ChetHeoPanel from "../score-panels/ChetHeoPanel";
import ChetChayPanel from "../score-panels/ChetChayPanel";
import ChantDePanel from "../score-panels/ChantDePanel";
import ScoreSummary from "../score-panels/ScoreSummary";

interface Props {
  isOpen: boolean;
  players: Player[];
  settings: GameSettings;
  roundNumber: number;
  initialData?: RoundDetail;
  onConfirm: (scores: Record<string, number>, details: RoundDetail) => void;
  onClose: () => void;
}

const TABS = ["ĂN PHẠT HEO", "CHẶT ĐÈ", "CHẾT HEO", "CHẾT CHÁY"];

export function ScoreBottomSheet({
  isOpen,
  players,
  settings,
  roundNumber,
  initialData,
  onConfirm,
  onClose,
}: Props) {
  const {
    ranks,
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
    isPlayerBurned,
    isPlayerEater,
    burnedCount,
    handlePlayerRankClick,
    toggleHeo,
    clearHeo,
    clearChetChay,
    getScore,
    allRanked,
    handleConfirm,
  } = useScoreState({ players, settings, initialData, onConfirm });

  return (
    <AppBottomSheet isOpen={isOpen} onClose={onClose} snapPoints={["92%"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              {initialData ? (
                <Pencil color="#f97316" size={18} />
              ) : (
                <Trophy color="#10b981" size={18} />
              )}
            </View>
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>
                  {initialData ? "Chỉnh sửa kết quả" : "Ghi điểm ván"}
                </Text>
                <View style={styles.roundTag}>
                  <Text style={styles.roundTagText}>Ván #{roundNumber}</Text>
                </View>
              </View>
              <Text style={styles.subText}>Chọn thứ tự về đích và các khoản phạt</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X color="#9ca3af" size={18} />
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView style={styles.scrollBody} contentContainerStyle={{ padding: 16, gap: 18 }}>
          {/* 1. Rank Selection */}
          <RankSelection
            players={players}
            ranks={ranks}
            isPlayerBurned={isPlayerBurned}
            handlePlayerClick={handlePlayerRankClick}
          />

          {/* 2. Sub Tabs */}
          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 3. Tab Panels */}
          {activeTab === "ĂN PHẠT HEO" && (
            <AnPhatHeoPanel
              players={players}
              anHeoSelection={anHeoSelection}
              phatHeoSelection={phatHeoSelection}
              toggleHeo={toggleHeo}
              clearHeo={clearHeo}
            />
          )}

          {activeTab === "CHẶT ĐÈ" && (
            <ChantDePanel
              players={players}
              chatEvents={chatEvents}
              onAddEvent={addChatEvent}
              onUpdateEvent={updateChatEvent}
              onRemoveEvent={removeChatEvent}
              heoValues={{
                do: settings.penalties?.heoDo ?? 4,
                den: settings.penalties?.heoDen ?? 2,
              }}
            />
          )}

          {activeTab === "CHẾT HEO" && (
            <ChetHeoPanel
              players={players}
              chetHeoSelection={chetHeoSelection}
              toggleHeo={toggleHeo}
              clearHeo={clearHeo}
            />
          )}

          {activeTab === "CHẾT CHÁY" && (
            <ChetChayPanel
              players={players}
              chetChaySelection={chetChaySelection}
              setChetChaySelection={setChetChaySelection}
              clearChetChay={clearChetChay}
              penaltyVal={settings.penalties?.chetChay ?? 4}
            />
          )}

          {/* 4. Score Summary Breakdown */}
          <ScoreSummary
            players={players}
            getScore={getScore}
            isPlayerBurned={isPlayerBurned}
            isPlayerEater={isPlayerEater}
            burnedCount={burnedCount}
          />
        </ScrollView>

        {/* Footer Confirm Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!allRanked}
            style={[styles.confirmBtn, !allRanked && styles.confirmBtnDisabled]}
          >
            <Text style={styles.confirmBtnText}>
              {allRanked ? "XÁC NHẬN ĐIỂM SỐ" : "CHƯA XẾP HẠNG ĐẦY ĐỦ"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgSheet },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: PALETTE.borderMedium,
    backgroundColor: PALETTE.bgSheetHeader,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  titleText: { color: "#ffffff", fontWeight: "bold", fontSize: 15 },
  roundTag: {
    backgroundColor: "rgba(239,68,68,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roundTagText: { color: "#f87171", fontSize: 10, fontWeight: "bold" },
  subText: { color: "#9ca3af", fontSize: 11 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollBody: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#080c14",
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabBtnActive: { backgroundColor: PALETTE.bgCardSubtle },
  tabText: { color: "#6b7280", fontSize: 10, fontWeight: "bold" },
  tabTextActive: { color: "#ffffff" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: PALETTE.borderMedium,
    backgroundColor: PALETTE.bgSheetHeader,
  },
  confirmBtn: {
    backgroundColor: PALETTE.brandRed,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { color: "#ffffff", fontWeight: "900", fontSize: 15 },
});
```

### 10.6. `src/components/score-panels/RankSelection.tsx`
(Đã định nghĩa đầy đủ trong Section 8.3).

### 10.7. `src/components/score-panels/AnPhatHeoPanel.tsx` (Ăn / Phạt Heo)
```tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { Player } from "../../types/game";
import { PALETTE } from "../../theme";

interface Props {
  players: Player[];
  anHeoSelection: Record<string, { do: number; den: number }>;
  phatHeoSelection: Record<string, { do: number; den: number }>;
  toggleHeo: (id: string, color: "do" | "den", type: "an" | "phat" | "chet") => void;
  clearHeo: (id: string, type: "an" | "phat" | "chet") => void;
}

export default function AnPhatHeoPanel({
  players,
  anHeoSelection,
  phatHeoSelection,
  toggleHeo,
  clearHeo,
}: Props) {
  return (
    <View style={styles.container}>
      {players.map((p) => {
        const an = anHeoSelection[p.id] || { do: 0, den: 0 };
        const phat = phatHeoSelection[p.id] || { do: 0, den: 0 };

        return (
          <View key={p.id} style={styles.playerCard}>
            <Text style={styles.playerName}>{p.name}</Text>

            <View style={styles.columnsRow}>
              {/* Cột Ăn Heo (+) */}
              <View style={styles.column}>
                <View style={styles.colHeader}>
                  <Text style={styles.anTitle}>ĂN HEO (+)</Text>
                  {(an.do > 0 || an.den > 0) && (
                    <TouchableOpacity onPress={() => clearHeo(p.id, "an")}>
                      <X color="#9ca3af" size={12} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    onPress={() => toggleHeo(p.id, "do", "an")}
                    style={[styles.heoBtn, an.do > 0 && styles.heoDoActive]}
                  >
                    <Text style={[styles.heoText, an.do > 0 && styles.heoDoTextActive]}>
                      Đỏ {an.do > 1 ? `x${an.do}` : ""}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => toggleHeo(p.id, "den", "an")}
                    style={[styles.heoBtn, an.den > 0 && styles.heoDenActive]}
                  >
                    <Text style={[styles.heoText, an.den > 0 && styles.heoDenTextActive]}>
                      Đen {an.den > 1 ? `x${an.den}` : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Cột Phạt Heo (-) */}
              <View style={styles.column}>
                <View style={styles.colHeader}>
                  <Text style={styles.phatTitle}>PHẠT HEO (-)</Text>
                  {(phat.do > 0 || phat.den > 0) && (
                    <TouchableOpacity onPress={() => clearHeo(p.id, "phat")}>
                      <X color="#9ca3af" size={12} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    onPress={() => toggleHeo(p.id, "do", "phat")}
                    style={[styles.heoBtn, phat.do > 0 && styles.heoDoActive]}
                  >
                    <Text style={[styles.heoText, phat.do > 0 && styles.heoDoTextActive]}>
                      Đỏ {phat.do > 1 ? `x${phat.do}` : ""}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => toggleHeo(p.id, "den", "phat")}
                    style={[styles.heoBtn, phat.den > 0 && styles.heoDenActive]}
                  >
                    <Text style={[styles.heoText, phat.den > 0 && styles.heoDenTextActive]}>
                      Đen {phat.den > 1 ? `x${phat.den}` : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  playerCard: {
    backgroundColor: PALETTE.bgCardSubtle,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
    gap: 8,
  },
  playerName: { color: "#ffffff", fontWeight: "bold", fontSize: 13, textTransform: "uppercase" },
  columnsRow: { flexDirection: "row", alignItems: "center" },
  column: { flex: 1, gap: 6 },
  colHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  anTitle: { color: PALETTE.brandEmerald, fontSize: 10, fontWeight: "bold" },
  phatTitle: { color: PALETTE.brandRose, fontSize: 10, fontWeight: "bold" },
  divider: { width: 1, height: "80%", backgroundColor: PALETTE.borderSubtle, marginHorizontal: 8 },
  btnRow: { flexDirection: "row", gap: 6 },
  heoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#0d111a",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  heoText: { color: "#9ca3af", fontSize: 11, fontWeight: "bold" },
  heoDoActive: { backgroundColor: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)" },
  heoDoTextActive: { color: "#f87171" },
  heoDenActive: { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" },
  heoDenTextActive: { color: "#ffffff" },
});
```

### 10.8. `src/components/score-panels/ChetHeoPanel.tsx` (Thối Heo)
```tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { Player } from "../../types/game";
import { PALETTE } from "../../theme";

interface Props {
  players: Player[];
  chetHeoSelection: Record<string, { do: number; den: number }>;
  toggleHeo: (id: string, color: "do" | "den", type: "an" | "phat" | "chet") => void;
  clearHeo: (id: string, type: "an" | "phat" | "chet") => void;
}

export default function ChetHeoPanel({ players, chetHeoSelection, toggleHeo, clearHeo }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>THỐI HEO KHI VỀ BÉT (TRỪ ĐIỂM)</Text>
      {players.map((p) => {
        const chet = chetHeoSelection[p.id] || { do: 0, den: 0 };
        return (
          <View key={p.id} style={styles.row}>
            <Text style={styles.name}>{p.name}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => toggleHeo(p.id, "do", "chet")}
                style={[styles.btn, chet.do > 0 && styles.btnDoActive]}
              >
                <Text style={[styles.btnText, chet.do > 0 && styles.textDoActive]}>
                  Đỏ {chet.do > 1 ? `x${chet.do}` : ""}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleHeo(p.id, "den", "chet")}
                style={[styles.btn, chet.den > 0 && styles.btnDenActive]}
              >
                <Text style={[styles.btnText, chet.den > 0 && styles.textDenActive]}>
                  Đen {chet.den > 1 ? `x${chet.den}` : ""}
                </Text>
              </TouchableOpacity>

              {(chet.do > 0 || chet.den > 0) && (
                <TouchableOpacity onPress={() => clearHeo(p.id, "chet")}>
                  <X color="#9ca3af" size={14} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  title: { color: "#9ca3af", fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PALETTE.bgCardSubtle,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  name: { color: "#ffffff", fontWeight: "bold", fontSize: 13 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#0d111a",
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  btnText: { color: "#9ca3af", fontSize: 11, fontWeight: "bold" },
  btnDoActive: { backgroundColor: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)" },
  textDoActive: { color: "#f87171" },
  btnDenActive: { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" },
  textDenActive: { color: "#ffffff" },
});
```

### 10.9. `src/components/score-panels/ChetChayPanel.tsx` (Cháy Bài / Cóng)
```tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { Player } from "../../types/game";
import { PALETTE } from "../../theme";

interface Props {
  players: Player[];
  chetChaySelection: Record<string, "an" | "chay" | "">;
  setChetChaySelection: React.Dispatch<React.SetStateAction<Record<string, "an" | "chay" | "">>>;
  clearChetChay: (id: string) => void;
  penaltyVal: number;
}

export default function ChetChayPanel({
  players,
  chetChaySelection,
  setChetChaySelection,
  clearChetChay,
  penaltyVal,
}: Props) {
  const handleToggle = (id: string, type: "an" | "chay") => {
    const next = { ...chetChaySelection };
    if (type === "an") {
      // Chỉ 1 người được ăn cóng
      Object.keys(next).forEach((k) => {
        if (next[k] === "an") next[k] = "";
      });
      next[id] = next[id] === "an" ? "" : "an";
    } else {
      next[id] = next[id] === "chay" ? "" : "chay";
    }
    setChetChaySelection(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CÓNG BÀI / CHÁY BÀI</Text>
        <Text style={styles.penalty}>Phạt: -{penaltyVal} điểm/người</Text>
      </View>

      {players.map((p) => {
        const status = chetChaySelection[p.id] || "";
        return (
          <View key={p.id} style={styles.row}>
            <Text
              style={[
                styles.name,
                status === "an" && styles.anText,
                status === "chay" && styles.chayText,
              ]}
            >
              {p.name}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleToggle(p.id, "an")}
                style={[styles.btn, status === "an" && styles.anBtnActive]}
              >
                <Text style={[styles.btnText, status === "an" && styles.anText]}>ĂN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleToggle(p.id, "chay")}
                style={[styles.btn, status === "chay" && styles.chayBtnActive]}
              >
                <Text style={[styles.btnText, status === "chay" && styles.chayText]}>CHÁY</Text>
              </TouchableOpacity>

              {status !== "" && (
                <TouchableOpacity onPress={() => clearChetChay(p.id)}>
                  <X color="#9ca3af" size={14} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#9ca3af", fontSize: 10, fontWeight: "bold" },
  penalty: { color: "#f87171", fontSize: 10, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PALETTE.bgCardSubtle,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  name: { color: "#d1d5db", fontWeight: "bold", fontSize: 13 },
  anText: { color: PALETTE.brandEmerald },
  chayText: { color: PALETTE.brandRose },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  btnText: { color: "#9ca3af", fontSize: 11, fontWeight: "bold" },
  anBtnActive: { backgroundColor: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.3)" },
  chayBtnActive: { backgroundColor: "rgba(244,63,94,0.15)", borderColor: "rgba(244,63,94,0.3)" },
});
```

### 10.10. `src/components/score-panels/ChantDePanel.tsx` (Chặt Đè)
```tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus, Trash2 } from "lucide-react-native";
import { Player, ChatEvent } from "../../types/game";
import { calculateEventScores } from "../../logic/scoringEngine";
import { PALETTE } from "../../theme";

interface Props {
  players: Player[];
  chatEvents: ChatEvent[];
  onAddEvent: () => void;
  onUpdateEvent: (ev: ChatEvent) => void;
  onRemoveEvent: (id: string) => void;
  heoValues: { do: number; den: number };
}

export default function ChantDePanel({
  players,
  chatEvents,
  onAddEvent,
  onUpdateEvent,
  onRemoveEvent,
  heoValues,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LƯỢT CHẶT ĐÈ (TIẾN LÊN)</Text>
        <Text style={styles.sub}>Đỏ: {heoValues.do}đ • Đen: {heoValues.den}đ</Text>
      </View>

      {chatEvents.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Chưa có lượt chặt đè nào trong ván này.</Text>
          <TouchableOpacity onPress={onAddEvent} style={styles.addBtn}>
            <Plus color="#ffffff" size={14} />
            <Text style={styles.addBtnText}>Thêm lượt chặt</Text>
          </TouchableOpacity>
        </View>
      ) : (
        chatEvents.map((ev, idx) => {
          const scores = calculateEventScores(ev, heoValues);
          return (
            <View key={ev.id} style={styles.eventCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.eventTitle}>Lượt #{idx + 1}</Text>
                <TouchableOpacity onPress={() => onRemoveEvent(ev.id)}>
                  <Trash2 color="#ef4444" size={14} />
                </TouchableOpacity>
              </View>

              {/* Toggle số heo bị chặt */}
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  onPress={() => onUpdateEvent({ ...ev, heoDo: ev.heoDo === 0 ? 1 : ev.heoDo === 1 ? 2 : 0 })}
                  style={[styles.heoBtn, ev.heoDo > 0 && styles.heoDoActive]}
                >
                  <Text style={[styles.heoText, ev.heoDo > 0 && styles.heoDoTextActive]}>
                    Heo Đỏ {ev.heoDo > 1 ? `x${ev.heoDo}` : ""}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onUpdateEvent({ ...ev, heoDen: ev.heoDen === 0 ? 1 : ev.heoDen === 1 ? 2 : 0 })}
                  style={[styles.heoBtn, ev.heoDen > 0 && styles.heoDenActive]}
                >
                  <Text style={[styles.heoText, ev.heoDen > 0 && styles.heoDenTextActive]}>
                    Heo Đen {ev.heoDen > 1 ? `x${ev.heoDen}` : ""}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Trình tự chặt đè */}
              <View style={styles.seqBox}>
                <Text style={styles.seqLabel}>Trình tự chặt ({ev.sequence.length} người):</Text>
                <View style={styles.seqRow}>
                  {ev.sequence.map((pid, sIdx) => {
                    const player = players.find((p) => p.id === pid);
                    const isLast = sIdx === ev.sequence.length - 1;
                    return (
                      <Text key={sIdx} style={[styles.seqName, isLast && styles.winnerSeq]}>
                        {player?.name || "P"} {isLast ? "(Ăn)" : "→"}
                      </Text>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#9ca3af", fontSize: 10, fontWeight: "bold" },
  sub: { color: PALETTE.brandEmerald, fontSize: 10, fontWeight: "bold" },
  emptyBox: {
    backgroundColor: PALETTE.bgCardSubtle,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  emptyText: { color: "#6b7280", fontSize: 11 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: PALETTE.brandEmerald,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnText: { color: "#ffffff", fontSize: 11, fontWeight: "bold" },
  eventCard: {
    backgroundColor: PALETTE.bgCardSubtle,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
    gap: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eventTitle: { color: "#ffffff", fontWeight: "bold", fontSize: 12 },
  toggleRow: { flexDirection: "row", gap: 8 },
  heoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#0d111a",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
  },
  heoText: { color: "#9ca3af", fontSize: 11, fontWeight: "bold" },
  heoDoActive: { backgroundColor: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)" },
  heoDoTextActive: { color: "#f87171" },
  heoDenActive: { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" },
  heoDenTextActive: { color: "#ffffff" },
  seqBox: { gap: 4 },
  seqLabel: { color: "#6b7280", fontSize: 10 },
  seqRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  seqName: { color: "#d1d5db", fontSize: 11, fontWeight: "bold" },
  winnerSeq: { color: PALETTE.brandEmerald },
});
```

### 10.11. `src/components/score-panels/ScoreSummary.tsx` (Tóm Tắt Điểm Ván)
```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Player } from "../../types/game";
import { PALETTE } from "../../theme";

interface Props {
  players: Player[];
  getScore: (id: string) => number;
  isPlayerBurned: (id: string) => boolean;
  isPlayerEater: (id: string) => boolean;
  burnedCount: number;
}

export default function ScoreSummary({
  players,
  getScore,
  isPlayerBurned,
  isPlayerEater,
  burnedCount,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TỔNG KẾT VÁN NÀY</Text>
      <View style={styles.box}>
        {players.map((p) => {
          const score = getScore(p.id);
          const burned = isPlayerBurned(p.id);
          const eater = isPlayerEater(p.id);

          return (
            <View key={p.id} style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.name}>{p.name}</Text>
                {burned && <Text style={styles.tagBurned}>CHÁY BÀI</Text>}
                {eater && burnedCount > 0 && <Text style={styles.tagEater}>ĂN CÓNG</Text>}
              </View>

              <Text
                style={[
                  styles.score,
                  score > 0 && styles.scoreGreen,
                  score < 0 && styles.scoreRed,
                ]}
              >
                {score > 0 ? `+${score}` : score}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { color: "#9ca3af", fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },
  box: {
    backgroundColor: PALETTE.bgCardSubtle,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.borderSubtle,
    gap: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { color: "#ffffff", fontWeight: "bold", fontSize: 13, textTransform: "uppercase" },
  tagBurned: {
    backgroundColor: "rgba(239,68,68,0.15)",
    color: "#f87171",
    fontSize: 9,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagEater: {
    backgroundColor: "rgba(16,185,129,0.15)",
    color: "#34d399",
    fontSize: 9,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  score: { fontSize: 16, fontWeight: "900", fontFamily: "monospace", color: "#9ca3af" },
  scoreGreen: { color: PALETTE.brandEmerald },
  scoreRed: { color: PALETTE.brandRose },
});
```

---

## 11. CHECKLIST KIỂM THỬ & TỐI ƯU HIỆU NĂNG

1. **Kiểm Tra Khởi Động:**
   - Bảo đảm `App.tsx` có bọc `<GestureHandlerRootView style={{ flex: 1 }}>`.
   - Bảo đảm `babel.config.js` có `plugins: ['react-native-reanimated/plugin']`.
2. **Kiểm Tra Trải Nghiệm:**
   - Bấm vào bàn chơi -> Hiện bục Sticky Podium người dẫn đầu có 👑.
   - Bấm Eye/EyeOff ngoài HomeScreen -> Ẩn hoặc Hiện điểm số của bàn chơi đó.
   - Bấm Ghi điểm -> Xếp hạng 2x2 xoay vòng mượt mà với hiệu ứng rung Haptic.
