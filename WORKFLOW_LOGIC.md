# 📚 WORKFLOW HỌC TẬP & LOGIC CHUYỂN TRẠNG THÁI CARD

## 🎯 Tổng quan Workflow chính

```
[Thẻ Mới] → [Đang Học] → [Đã Thuộc]
interval=0    0<interval<7   interval>=7 & ease>=2.0
```

## 📊 Chi tiết 3 trạng thái card

### 1️⃣ **Thẻ Mới (New Card)**

- **Điều kiện**: `interval = 0`
- **Màu sắc**: Xám (chưa học lần nào)
- **Next review**: Ngay lập tức (hiện trong phiên học hôm nay)

### 2️⃣ **Đang Học (Learning Card)**

- **Điều kiện**: `interval > 0` NHƯNG `interval < 7` HOẶC `ease_factor < 2.0`
- **Màu sắc**: Vàng/Cam (đang trong quá trình ghi nhớ)
- **Next review**: 1-6 ngày (tùy thuộc progress)

### 3️⃣ **Đã Thuộc (Mastered Card)**

- **Điều kiện**: `interval >= 7 ngày` VÀ `ease_factor >= 2.0`
- **Màu sắc**: Xanh lá (đã nhớ vững)
- **Next review**: 7-180 ngày (càng thuộc càng xa)

---

## 🔄 Quá trình chuyển trạng thái (Ví dụ thực tế)

### **Ngày 1 - Học lần đầu**

```javascript
// Card ban đầu
interval: 0  (Thẻ Mới)
ease_factor: 2.5
next_review: now

// User nhấn "Tốt" (grade=2)
➜ interval: 1 ngày (Đang Học)
➜ ease_factor: 2.55 (+0.05)
➜ next_review: Ngày 2
```

### **Ngày 2 - Ôn lần 2**

```javascript
// Card hiện tại
interval: 1  (Đang Học)
ease_factor: 2.55

// User nhấn "Tốt" (grade=2)
➜ interval: 3 ngày (Đang Học)
➜ ease_factor: 2.60 (+0.05)
➜ next_review: Ngày 5
```

### **Ngày 5 - Ôn lần 3**

```javascript
// Card hiện tại
interval: 3  (Đang Học)
ease_factor: 2.60

// User nhấn "Dễ" (grade=3)
➜ interval: 5 ngày (Đang Học - vẫn <7)
➜ ease_factor: 2.75 (+0.15)
➜ next_review: Ngày 10
```

### **Ngày 10 - Ôn lần 4 (CHUYỂN ĐỔI)**

```javascript
// Card hiện tại
interval: 5  (Đang Học)
ease_factor: 2.75

// User nhấn "Tốt" (grade=2)
➜ interval: 8 ngày (VỚI 8 >= 7)
➜ ease_factor: 2.80 (+0.05)
➜ next_review: Ngày 18

✅ CHÍNH THỨC "ĐÃ THUỘC" (interval>=7 VÀ ease>=2.0)
```

### **Ngày 18 - Ôn lần 5 (Đã thuộc)**

```javascript
// Card hiện tại
interval: 8  (Đã Thuộc)
ease_factor: 2.80

// User nhấn "Tốt" (grade=2)
➜ interval: 8 * 2.80 = 22 ngày (Đã Thuộc)
➜ ease_factor: 2.85 (+0.05)
➜ next_review: Ngày 40

🚀 Interval tăng NHANH HƠN (nhân với ease_factor)
```

---

## ⚠️ Trường hợp quên (Grade 0-1)

### **Quên hoàn toàn (Grade 0)**

```javascript
// Card đang ở interval: 22 ngày
interval: 22
ease_factor: 2.5

// User nhấn "Lại" (grade=0)
➜ interval: 0 ngày (RESET về Thẻ Mới)
➜ ease_factor: 2.3 (-0.2)
➜ next_review: Sau 10 phút

⚠️ Phải học lại từ đầu!
```

### **Khó nhớ (Grade 1)**

```javascript
// Card đang ở interval: 22 ngày
interval: 22
ease_factor: 2.5

// User nhấn "Khó" (grade=1)
➜ interval: 11 ngày (giảm 50%)
➜ ease_factor: 2.35 (-0.15)
➜ next_review: Sau 11 ngày

⏪ Lùi lại nhưng không reset về 0
```

---

## 🎮 Logic trong code

### **File: `srsService.ts`**

```typescript
if (grade < 2) {
  // 🔴 Quên hoặc Khó
  if (grade === 0) {
    newInterval = 0; // ← RESET VỀ THẺ MỚI
    newEaseFactor = Math.max(1.3, currentStatus.ease_factor - 0.2);
  } else {
    newInterval = Math.max(1, Math.floor(currentStatus.interval * 0.5));
    newEaseFactor = Math.max(1.3, currentStatus.ease_factor - 0.15);
  }
} else {
  // 🟢 Tốt hoặc Dễ
  if (currentStatus.interval === 0) {
    newInterval = 1; // ← LẦN ĐẦU: 1 ngày
  } else if (currentStatus.interval === 1) {
    newInterval = 3; // ← LẦN 2: 3 ngày
  } else if (currentStatus.interval < 7) {
    newInterval = Math.round(currentStatus.interval * 1.5); // ← ĐANG HỌC: x1.5
  } else {
    newInterval = Math.round(
      currentStatus.interval * currentStatus.ease_factor
    ); // ← ĐÃ THUỘC: x2-2.5
  }
}
```

### **File: `studyController.ts`**

```typescript
// Đếm số thẻ "Đã thuộc"
const masteredCards = await Card.countDocuments({
  user_id: userId,
  "srs_status.interval": { $gte: 7 }, // ← Interval >= 7 ngày
  "srs_status.ease_factor": { $gte: 2.0 }, // ← Ease >= 2.0
});
```

---

## 📈 Timeline minh họa (Card từ Mới → Thuộc)

```
Day 0:  [Mới] interval=0         ➜ Nhấn "Tốt"
Day 1:  [Học] interval=1         ➜ Nhấn "Tốt"
Day 4:  [Học] interval=3         ➜ Nhấn "Dễ"
Day 9:  [Học] interval=5         ➜ Nhấn "Tốt"
Day 17: [THUỘC ✅] interval=8    ➜ Nhấn "Tốt"
Day 39: [THUỘC] interval=22      ➜ Nhấn "Dễ"
Day 94: [THUỘC] interval=55      ➜ Nhấn "Tốt"
...
```

**Tổng cộng**: Cần ít nhất **5 lần review đúng** để card chuyển từ Mới → Thuộc (mất ~17 ngày)

---

## 🎯 Điểm mấu chốt để "Đã Thuộc"

1. ✅ **Phải đạt interval >= 7 ngày** (ít nhất 1 tuần không quên)
2. ✅ **Phải đạt ease_factor >= 2.0** (chứng tỏ không khó nhớ)
3. ⏰ **Thường mất 4-6 lần review** (nếu đều nhấn "Tốt"/"Dễ")
4. ⚠️ **Nếu nhấn "Lại"**: Reset về interval=0 (Thẻ Mới)
5. 📉 **Nếu nhấn "Khó"**: Giảm interval 50% (lùi tiến độ)

---

## 💡 Cải thiện đề xuất

### 1. **Hiển thị trạng thái rõ ràng trên UI**

Thêm badge "Đang Học" / "Đã Thuộc" ở góc card:

```jsx
// Trong StudySession.jsx
const getCardStatus = (card) => {
  if (card.srs_status.interval === 0) return { label: "Mới", color: "gray" };
  if (card.srs_status.interval >= 7 && card.srs_status.ease_factor >= 2.0) {
    return { label: "Đã Thuộc", color: "green" };
  }
  return { label: "Đang Học", color: "yellow" };
};

// Hiển thị trong card
<div className={`badge ${status.color}`}>{status.label}</div>;
```

### 2. **Hiển thị tiến độ đến "Đã Thuộc"**

```jsx
// Tính % tiến độ
const masteryProgress = Math.min(100, (card.srs_status.interval / 7) * 100);

<div className="progress-bar">
  <div className="fill" style={{ width: `${masteryProgress}%` }}></div>
  <span>{card.srs_status.interval}/7 ngày để thuộc</span>
</div>;
```

### 3. **Thông báo khi chuyển trạng thái**

```jsx
if (response.data.new_interval >= 7 && oldInterval < 7) {
  // Vừa đạt "Đã Thuộc"
  showCelebration("🎉 Bạn đã thuộc từ này!");
}
```

### 4. **Giải thích sau mỗi review**

```jsx
const explainNextReview = (grade, newInterval) => {
  const messages = {
    0: "Ôn lại sau 10 phút (Phải học lại từ đầu)",
    1: "Ôn lại sau ${newInterval} ngày (Khó nhớ, giảm tốc độ)",
    2: "Ôn lại sau ${newInterval} ngày (Tiến bộ tốt!)",
    3: "Ôn lại sau ${newInterval} ngày (Xuất sắc, tăng tốc!)",
  };
  return messages[grade];
};
```

---

## 📝 Tóm tắt

**"Đã Thuộc"** = Card có `interval >= 7 ngày` VÀ `ease_factor >= 2.0`

**Cách đạt được**:

1. Học đều đặn 4-6 lần
2. Không bỏ sót review
3. Nhấn "Tốt" hoặc "Dễ" thường xuyên
4. Tránh nhấn "Lại" (reset về 0)

**Kết quả**: Thẻ sẽ được ôn lại với khoảng cách ngày càng xa (7 → 22 → 55 → 150 ngày...), tối ưu hóa ghi nhớ dài hạn! 🚀
