import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studyService } from "../services";

export default function Statistics() {
  const [stats, setStats] = useState({
    total_cards: 0,
    learning_cards: 0,
    mastered_cards: 0,
    new_cards: 0,
    due_today: 0,
    current_streak: 0,
    longest_streak: 0,
    weekly_activity: [],
    total_reviews: 0,
    avg_reviews_per_day: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("week");
  const navigate = useNavigate();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await studyService.getStudyStats();
      setStats(data.data.stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  const masteryPercentage =
    stats.total_cards > 0
      ? Math.round((stats.mastered_cards / stats.total_cards) * 100)
      : 0;

  // Transform weekly_activity data from API
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayIndex = date.getDay();

    const activityItem = stats.weekly_activity?.find(
      (item) => item._id === dateStr
    );
    const count = activityItem ? activityItem.count : 0;

    weekData.push({
      day: dayNames[dayIndex],
      value: count,
      current: i === 0,
    });
  }

  // Normalize values to percentage (0-100) for display
  const maxCount = Math.max(...weekData.map((d) => d.value), 1);
  weekData.forEach((item) => {
    item.displayValue =
      maxCount > 0 ? Math.round((item.value / maxCount) * 100) : 0;
    if (item.displayValue === 0 && item.value > 0) item.displayValue = 10; // Minimum visible height
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden pb-20">
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center p-4 pb-3 justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            >
              <span className="material-symbols-outlined text-gray-800 dark:text-gray-200 text-3xl">
                arrow_back
              </span>
            </button>
            <h1 className="text-gray-900 dark:text-white text-xl lg:text-2xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center lg:text-left flex items-center justify-center lg:justify-start gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">
                bar_chart
              </span>
              Thống Kê
            </h1>
            <div className="flex size-11 shrink-0 lg:hidden"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 lg:px-6">
        <div className="flex py-3">
          <div className="flex h-10 flex-1 lg:max-w-md items-center justify-center rounded-full bg-black/5 dark:bg-white/5 p-1">
            {["week", "month", "year"].map((filter) => (
              <label
                key={filter}
                className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-zinc-700 has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-gray-900 dark:has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal"
              >
                <span className="truncate">
                  {filter === "week"
                    ? "Tuần"
                    : filter === "month"
                    ? "Tháng"
                    : "Năm"}
                </span>
                <input
                  checked={timeFilter === filter}
                  onChange={() => setTimeFilter(filter)}
                  className="invisible w-0"
                  name="time-filter"
                  type="radio"
                  value={filter}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap lg:grid lg:grid-cols-2 gap-4 mb-4">
          <div className="flex min-w-[158px] flex-1 lg:flex-none flex-col gap-2 rounded-xl bg-white dark:bg-zinc-800 p-6 border border-black/10 dark:border-white/10 shadow-sm">
            <p className="text-gray-800 dark:text-gray-300 text-base font-medium leading-normal flex items-center gap-2">
              <span
                className="material-symbols-outlined text-orange-500 text-2xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                local_fire_department
              </span>
              Chuỗi ngày học
            </p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl lg:text-4xl font-bold leading-tight">
              {stats.current_streak} ngày
            </p>
          </div>

          <div className="flex min-w-[158px] flex-1 lg:flex-none flex-col gap-2 rounded-xl bg-white dark:bg-zinc-800 p-6 border border-black/10 dark:border-white/10 shadow-sm">
            <p className="text-gray-800 dark:text-gray-300 text-base font-medium leading-normal flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-500 text-2xl">
                military_tech
              </span>
              Kỷ lục
            </p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl lg:text-4xl font-bold leading-tight">
              {stats.longest_streak} ngày
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 lg:p-8 bg-white dark:bg-zinc-800 shadow-sm">
            <div className="flex flex-col gap-1 mb-6">
              <p className="text-gray-800 dark:text-gray-300 text-base lg:text-lg font-medium leading-normal">
                Hoạt động học tập
              </p>
              <p className="text-gray-900 dark:text-white tracking-light text-[32px] lg:text-[40px] font-bold leading-tight truncate">
                {stats.total_reviews} lượt ôn
              </p>
              <div className="flex gap-1">
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                  Trung bình {stats.avg_reviews_per_day} lượt/ngày
                </p>
              </div>
            </div>

            <div className="grid min-h-[180px] lg:min-h-[220px] grid-flow-col gap-3 lg:gap-4 grid-rows-[1fr_auto] items-end justify-items-center">
              {weekData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 w-full h-full justify-end"
                >
                  <div
                    className={`w-full rounded-full transition-all ${
                      item.current
                        ? "bg-primary"
                        : "bg-primary/20 dark:bg-primary/40"
                    }`}
                    style={{ height: `${item.displayValue || 5}%` }}
                    title={`${item.value} lượt ôn tập`}
                  ></div>
                  <p
                    className={`text-xs font-bold leading-normal tracking-[0.015em] ${
                      item.current
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.day}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-start rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 p-6 lg:p-8 gap-6 shadow-sm">
            <div className="relative flex h-36 w-36 lg:h-40 lg:w-40 items-center justify-center mx-auto lg:mx-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="stroke-current text-gray-200 dark:text-gray-700"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9155"
                  strokeWidth="3"
                ></circle>
                <circle
                  className="stroke-current text-primary"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9155"
                  strokeDasharray={`${masteryPercentage}, ${
                    100 - masteryPercentage
                  }`}
                  strokeLinecap="round"
                  strokeWidth="3"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {masteryPercentage}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Đã thuộc
                </span>
              </div>
            </div>

            <div className="flex w-full min-w-0 grow flex-col items-stretch justify-center gap-2">
              <p className="text-gray-900 dark:text-white text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em]">
                Hiệu suất học tập
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm lg:text-base">
                <div>
                  <p className="text-gray-400 dark:text-gray-500">
                    Tổng số thẻ
                  </p>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {stats.total_cards}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 dark:text-gray-500">Đã thuộc</p>
                  <p className="text-green-600 dark:text-green-400 font-semibold">
                    {stats.mastered_cards}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 dark:text-gray-500">Đang học</p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    {stats.learning_cards}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 dark:text-gray-500">Mới</p>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold">
                    {stats.new_cards}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/study")}
                className="flex mt-2 min-w-[84px] max-w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 lg:h-12 px-6 lg:px-8 bg-primary text-gray-900 text-sm lg:text-base font-medium leading-normal hover:opacity-90 transition-opacity"
              >
                <span className="truncate">Ôn tập ngay</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pb-4">
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 p-6 lg:p-8 shadow-sm">
            <h3 className="text-gray-900 dark:text-white text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em]">
              Thành tích
            </h3>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-500">
                  <span className="material-symbols-outlined !text-4xl lg:!text-5xl">
                    school
                  </span>
                </div>
                <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-300">
                  Người học chăm chỉ
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-red-400/20 text-red-500">
                  <span className="material-symbols-outlined !text-4xl lg:!text-5xl">
                    local_fire_department
                  </span>
                </div>
                <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-300">
                  Streak 10 ngày
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-blue-400/20 text-blue-500">
                  <span className="material-symbols-outlined !text-4xl lg:!text-5xl">
                    psychology
                  </span>
                </div>
                <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-300">
                  Chuyên gia từ vựng
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-gray-400/20 text-gray-500">
                  <span className="material-symbols-outlined !text-4xl lg:!text-5xl">
                    rocket_launch
                  </span>
                </div>
                <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Vượt 1000 từ
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-gray-400/20 text-gray-500">
                  <span className="material-symbols-outlined !text-4xl lg:!text-5xl">
                    timer
                  </span>
                </div>
                <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Học 30 phút
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-gray-400/20 text-gray-500">
                  <span className="material-symbols-outlined !text-4xl lg:!text-5xl">
                    social_leaderboard
                  </span>
                </div>
                <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Top 10
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
