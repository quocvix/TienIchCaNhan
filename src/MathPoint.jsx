import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "score-tracker-flex-v1";
const DEFAULT_PLAYER_COUNT = 4;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 12;

const createPlayers = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: Date.now() + index + Math.random(),
    name: `Người chơi ${index + 1}`,
  }));

const createEmptyRoundInput = (count) => Array(count).fill("");

const normalizeScore = (value) => Number(value || 0);

const buildDerivedData = (rounds, players) => {
  const totals = Array(players.length).fill(0);

  const cumulativeByRound = rounds.map((round, index) => {
    round.scores.forEach((score, scoreIndex) => {
      totals[scoreIndex] += normalizeScore(score);
    });

    return {
      id: round.id,
      roundNumber: index + 1,
      totals: [...totals],
    };
  });

  const ranking = players
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
  rounds: [],
  currentRound: createEmptyRoundInput(DEFAULT_PLAYER_COUNT),
  editingRoundId: null,
  editingScores: [],
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

    const parsed = JSON.parse(saved);
    const savedPlayers = Array.isArray(parsed.players) ? parsed.players : createPlayers(DEFAULT_PLAYER_COUNT);
    const playerCount = Math.max(MIN_PLAYERS, savedPlayers.length || DEFAULT_PLAYER_COUNT);

    return {
      players: savedPlayers,
      rounds: Array.isArray(parsed.rounds)
        ? parsed.rounds.map((round) => ({
            ...round,
            scores: Array.from({ length: playerCount }, (_, index) => normalizeScore(round.scores?.[index])),
          }))
        : [],
      currentRound: Array.from({ length: playerCount }, (_, index) => parsed.currentRound?.[index] ?? ""),
      editingRoundId: null,
      editingScores: [],
    };
  } catch (error) {
    return createInitialState();
  }
};

export default function ScoreTrackerFlexiblePlayers() {
  const [players, setPlayers] = useState(() => loadInitialState().players);
  const [rounds, setRounds] = useState(() => loadInitialState().rounds);
  const [currentRound, setCurrentRound] = useState(() => loadInitialState().currentRound);
  const [editingRoundId, setEditingRoundId] = useState(() => loadInitialState().editingRoundId);
  const [editingScores, setEditingScores] = useState(() => loadInitialState().editingScores);

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
      })
    );
  }, [players, rounds, currentRound]);

  const handlePlayerNameChange = (id, value) => {
    setPlayers((prev) =>
      prev.map((player, index) =>
        player.id === id
          ? {
              ...player,
              name: value || `Người chơi ${index + 1}`,
            }
          : player
      )
    );
  };

  const handleScoreChange = (index, value) => {
    if (!/^-?\d*$/.test(value)) {
      return;
    }

    setCurrentRound((prev) => prev.map((score, scoreIndex) => (scoreIndex === index ? value : score)));
  };

  const handleEditingScoreChange = (index, value) => {
    if (!/^-?\d*$/.test(value)) {
      return;
    }

    setEditingScores((prev) => prev.map((score, scoreIndex) => (scoreIndex === index ? value : score)));
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
    setRounds((prev) => prev.map((round) => ({ ...round, scores: [...round.scores, 0] })));

    if (editingRoundId) {
      setEditingScores((prev) => [...prev, "0"]);
    }
  };

  const removePlayer = (playerId) => {
    if (players.length <= MIN_PLAYERS) {
      return;
    }

    const removeIndex = players.findIndex((player) => player.id === playerId);
    if (removeIndex === -1) {
      return;
    }

    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    setCurrentRound((prev) => prev.filter((_, index) => index !== removeIndex));
    setRounds((prev) =>
      prev.map((round) => ({
        ...round,
        scores: round.scores.filter((_, index) => index !== removeIndex),
      }))
    );

    if (editingRoundId) {
      setEditingScores((prev) => prev.filter((_, index) => index !== removeIndex));
    }
  };

  const addRound = () => {
    const newRound = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      scores: currentRound.map(normalizeScore),
    };

    setRounds((prev) => [...prev, newRound]);
    setCurrentRound(createEmptyRoundInput(players.length));
  };

  const startEditRound = (round) => {
    setEditingRoundId(round.id);
    setEditingScores(round.scores.map((score) => String(score)));
  };

  const cancelEditRound = () => {
    setEditingRoundId(null);
    setEditingScores([]);
  };

  const saveEditRound = (roundId) => {
    setRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              scores: editingScores.map(normalizeScore),
            }
          : round
      )
    );

    cancelEditRound();
  };

  const removeRound = (roundId) => {
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
    [rounds, players]
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tính điểm nhiều người chơi</h1>
              <p className="mt-2 text-sm text-slate-600">
                Tự lưu dữ liệu, thêm hoặc bớt người chơi linh hoạt, và sửa điểm của từng lượt đã nhập.
              </p>
            </div>
            <button
              onClick={resetAll}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Đặt lại tất cả
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Người chơi</h2>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={addPlayer}
                    disabled={players.length >= MAX_PLAYERS}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Thêm người chơi
                  </button>
                  <div className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
                    {players.length} người chơi
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {players.map((player, index) => (
                  <div key={player.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium text-slate-700">Người chơi {index + 1}</label>
                      <button
                        onClick={() => removePlayer(player.id)}
                        disabled={players.length <= MIN_PLAYERS}
                        className="rounded-xl border border-slate-300 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Xóa
                      </button>
                    </div>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Nhập điểm cho lượt mới</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {players.map((player, index) => (
                  <div key={player.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="text-sm font-medium text-slate-600">{player.name}</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={currentRound[index] ?? ""}
                      onChange={(e) => handleScoreChange(index, e.target.value)}
                      placeholder="Nhập điểm"
                      className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 text-lg font-semibold outline-none transition focus:border-slate-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={addRound}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Thêm lượt
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử điểm từng lượt</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700">Lượt</th>
                      {players.map((player) => (
                        <th key={player.id} className="px-3 py-2 text-left text-sm font-semibold text-slate-700">
                          {player.name}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700">Sửa</th>
                      <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rounds.length === 0 ? (
                      <tr>
                        <td
                          colSpan={players.length + 3}
                          className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500"
                        >
                          Chưa có lượt nào được thêm.
                        </td>
                      </tr>
                    ) : (
                      rounds.map((round, index) => {
                        const isEditing = editingRoundId === round.id;

                        return (
                          <tr key={round.id} className="bg-slate-50">
                            <td className="rounded-l-2xl px-3 py-3 text-sm font-medium text-slate-800">
                              {index + 1}
                            </td>
                            {players.map((player, scoreIndex) => (
                              <td key={`${round.id}-${player.id}`} className="px-3 py-3 text-sm text-slate-700">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={editingScores[scoreIndex] ?? ""}
                                    onChange={(e) => handleEditingScoreChange(scoreIndex, e.target.value)}
                                    className="w-24 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                                  />
                                ) : (
                                  round.scores[scoreIndex]
                                )}
                              </td>
                            ))}
                            <td className="px-3 py-3 text-sm text-slate-700">
                              {isEditing ? (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => saveEditRound(round.id)}
                                    className="rounded-xl bg-slate-900 px-3 py-1.5 text-white transition hover:opacity-90"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={cancelEditRound}
                                    className="rounded-xl border border-slate-300 px-3 py-1.5 transition hover:bg-white"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditRound(round)}
                                  className="rounded-xl border border-slate-300 px-3 py-1.5 transition hover:bg-white"
                                >
                                  Sửa
                                </button>
                              )}
                            </td>
                            <td className="rounded-r-2xl px-3 py-3 text-sm text-slate-700">
                              <button
                                onClick={() => removeRound(round.id)}
                                className="rounded-xl border border-slate-300 px-3 py-1.5 transition hover:bg-white"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Điểm cộng dồn qua mỗi lượt</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700">Lượt</th>
                      {players.map((player) => (
                        <th key={player.id} className="px-3 py-2 text-left text-sm font-semibold text-slate-700">
                          {player.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cumulativeByRound.length === 0 ? (
                      <tr>
                        <td
                          colSpan={players.length + 1}
                          className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500"
                        >
                          Chưa có dữ liệu cộng dồn.
                        </td>
                      </tr>
                    ) : (
                      cumulativeByRound.map((row) => (
                        <tr key={row.id} className="bg-slate-50">
                          <td className="rounded-l-2xl px-3 py-3 text-sm font-medium text-slate-800">
                            {row.roundNumber}
                          </td>
                          {row.totals.map((score, scoreIndex) => (
                            <td key={`${row.id}-total-${scoreIndex}`} className="px-3 py-3 text-sm text-slate-700">
                              {score}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Điểm cuối cùng</h2>
              <div className="mt-4 space-y-3">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700">{player.name}</span>
                    <span className="text-lg font-bold text-slate-900">{totals[index] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Xếp hạng</h2>
              <div className="mt-4 space-y-3">
                {ranking.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Hạng {index + 1}
                      </div>
                      <div className="text-sm font-medium text-slate-800">{item.name}</div>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{item.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Kiểm tra nhanh</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Tải lại trang thì tên người chơi, lịch sử lượt và điểm hiện tại vẫn còn do đã lưu localStorage.</li>
                <li>• Thêm người chơi mới thì tất cả lượt cũ phải tự thêm cột điểm 0 cho người đó.</li>
                <li>• Xóa một người chơi thì bảng lịch sử, bảng cộng dồn và điểm tổng phải đồng bộ theo.</li>
                <li>• Sửa một lượt rồi bấm lưu thì tổng điểm và xếp hạng phải cập nhật ngay.</li>
                <li>• Bấm đặt lại tất cả thì dữ liệu trên màn hình và localStorage phải bị xóa hết.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Cách dùng</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Đổi tên người chơi ở phần đầu.</li>
                <li>• Có thể thêm hoặc xóa người chơi linh hoạt.</li>
                <li>• Nhập điểm của từng người cho mỗi lượt rồi bấm <strong>Thêm lượt</strong>.</li>
                <li>• Muốn sửa lượt cũ thì bấm <strong>Sửa</strong>, chỉnh điểm rồi bấm <strong>Lưu</strong>.</li>
                <li>• Dữ liệu sẽ tự lưu trên trình duyệt.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
