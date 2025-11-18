import { ISRSStatus } from "../models/Card";

/**
 * Thuật toán SM-2 (Spaced Repetition) cải tiến
 *
 * Grade mapping:
 * 0 = Again (Quên hoàn toàn) - Reset về 0
 * 1 = Hard (Khó, hơi quên) - Giảm interval
 * 2 = Good (Tốt, nhớ được) - Tăng interval bình thường
 * 3 = Easy (Dễ, nhớ rất rõ) - Tăng interval nhanh
 *
 * Tiêu chí "Đã thuộc" (Mastered):
 * - interval >= 7 ngày (1 tuần)
 * - ease_factor >= 2.0
 * - Đã review thành công ít nhất 3 lần
 *
 * @param grade - Điểm đánh giá từ 0-3
 * @param currentStatus - Trạng thái SRS hiện tại của thẻ
 * @returns Trạng thái SRS mới
 */
export const calculateNextReview = (
  grade: number,
  currentStatus: ISRSStatus
): ISRSStatus => {
  let newInterval: number;
  let newEaseFactor: number = currentStatus.ease_factor;

  // Xử lý theo grade
  if (grade < 2) {
    // Again (0) hoặc Hard (1): Reset hoặc giảm interval
    if (grade === 0) {
      // Quên hoàn toàn: Reset về 0 (ôn lại ngay trong 10 phút)
      newInterval = 0;
      newEaseFactor = Math.max(1.3, currentStatus.ease_factor - 0.2);
    } else {
      // Khó: Giảm interval về 1 ngày hoặc giữ nguyên nếu đang < 1
      newInterval = Math.max(1, Math.floor(currentStatus.interval * 0.5));
      newEaseFactor = Math.max(1.3, currentStatus.ease_factor - 0.15);
    }
  } else {
    // Good (2) hoặc Easy (3): Tăng interval theo SM-2
    if (currentStatus.interval === 0) {
      // Lần đầu tiên nhớ được: 1 ngày
      newInterval = 1;
    } else if (currentStatus.interval === 1) {
      // Lần thứ 2: 3 ngày (thay vì 6)
      newInterval = 3;
    } else if (currentStatus.interval < 7) {
      // Chưa thuộc: tăng từ từ đến 7 ngày
      newInterval = Math.round(currentStatus.interval * 1.5);
    } else {
      // Đã thuộc: áp dụng ease_factor đầy đủ
      newInterval = Math.round(
        currentStatus.interval * currentStatus.ease_factor
      );
    }

    // Điều chỉnh ease_factor
    if (grade === 2) {
      // Good: tăng nhẹ ease_factor
      newEaseFactor = Math.min(2.5, currentStatus.ease_factor + 0.05);
    } else {
      // Easy: tăng ease_factor nhiều hơn
      newEaseFactor = Math.min(2.5, currentStatus.ease_factor + 0.15);
    }
  }

  // Đảm bảo ease_factor trong khoảng hợp lệ [1.3, 2.5]
  newEaseFactor = Math.max(1.3, Math.min(2.5, newEaseFactor));

  // Giới hạn interval tối đa 180 ngày (6 tháng)
  newInterval = Math.min(180, newInterval);

  // Tính next_review_at
  const nextReviewAt = new Date();
  if (newInterval === 0) {
    // Review lại sau 10 phút
    nextReviewAt.setMinutes(nextReviewAt.getMinutes() + 10);
  } else {
    nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);
  }

  return {
    interval: newInterval,
    ease_factor: newEaseFactor,
    next_review_at: nextReviewAt,
  };
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 * Dùng để xáo trộn thứ tự thẻ trong phiên học
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
