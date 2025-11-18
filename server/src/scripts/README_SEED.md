# Seed Data Instructions

## Overview

MemoHub có 2 loại seed data:

### 1. System Decks Seed (`seedSystemDecks.ts`)

**Mục đích**: Tạo các bộ thẻ hệ thống (IELTS, JLPT, TOPIK, HSK) để user có thể copy vào collection của mình.

**Chạy:**

```bash
cd server
npm run seed:system
```

**Dữ liệu tạo:**

- 4 System Decks (IELTS 6.0, JLPT N5, TOPIK I, HSK 1)
- 20 System Cards cho mỗi deck
- Total: 80 system cards

**Sử dụng:**

- User vào trang System Decks
- Click "Sao chép vào bộ thẻ của tôi"
- Deck và cards sẽ được copy vào My Decks

---

### 2. Full Data Seed (`seedFullData.ts`)

**Mục đích**: Tạo dữ liệu đầy đủ cho testing và demo, bao gồm User, Decks, Cards và Review History để xem thống kê hoạt động.

**Chạy:**

```bash
cd server
npm run seed:full
```

**Dữ liệu tạo:**

#### User

- Email: `test@memohub.com`
- Password: `123456`
- Username: `testuser`
- Daily goal: 30 cards
- Member since: 60 ngày trước

#### Decks (3 decks)

1. **IELTS Essential Vocabulary** (30 cards)

   - 10 Mastered (interval >= 7 days)
   - 10 Learning (interval 1-6 days)
   - 10 New (interval = 0)

2. **Business English** (20 cards)

   - 5 Mastered
   - 8 Learning
   - 7 New

3. **Academic Writing** (15 cards)
   - 2 Mastered
   - 5 Learning
   - 8 New

**Total: 65 cards**

#### Review History

- 30 ngày lịch sử review
- 10-40 reviews mỗi ngày (random)
- Grade distribution: Again(10%), Hard(20%), Good(50%), Easy(20%)
- Total: ~600-800 reviews

**Thống kê sau khi seed:**

```
✅ Mastered: ~17 cards (26%)
⏳ Learning: ~23 cards (35%)
📝 New: ~25 cards (39%)
🔔 Due today: ~30 cards
🔥 Current streak: ~30 days
📊 Total reviews: ~700
```

---

## Workflow Sử Dụng

### Lần đầu setup:

```bash
# 1. Seed system decks (nền tảng)
cd server
npm run seed:system

# 2. Seed user data (testing)
npm run seed:full

# 3. Chạy server
npm run dev

# 4. Login và test
# Email: test@memohub.com
# Password: 123456
```

### Reset và seed lại:

```bash
# Seed lại toàn bộ (xóa dữ liệu cũ)
cd server
npm run seed:full

# Hoặc chỉ seed system decks
npm run seed:system
```

---

## Kiểm Tra Sau Khi Seed

### 1. Dashboard

- ✅ Hiển thị streak (30 days)
- ✅ Cards due today (~30 cards)
- ✅ Total cards (65)
- ✅ Mastered cards (~17)

### 2. Statistics

- ✅ Weekly activity chart (7 days data)
- ✅ Review count per day
- ✅ Accuracy percentage
- ✅ Current streak

### 3. Decks

- ✅ 3 My Decks hiển thị
- ✅ Card counts chính xác
- ✅ Status distribution (Mastered/Learning/New)

### 4. Study Session

- ✅ ~30 cards due today
- ✅ Mix của new + review cards
- ✅ SRS algorithm hoạt động
- ✅ Review history được lưu

### 5. System Decks

- ✅ 4 System Decks hiển thị
- ✅ Copy system deck tạo My Deck mới
- ✅ 20 cards được copy

---

## Lưu Ý

1. **seedFullData.ts XÓA TẤT CẢ DỮ LIỆU** trước khi seed
2. **seedSystemDecks.ts CHỈ XÓA System Decks**, không ảnh hưởng user data
3. Mật khẩu default: `123456` (đã hash với bcrypt)
4. Review history được tạo ngẫu nhiên nhưng logic (reviews sau ngày tạo card)
5. SRS intervals được phân bổ realistic (new: 0, learning: 1-6, mastered: 7+)

---

## Troubleshooting

### Lỗi MongoDB Connection

```bash
# Kiểm tra MongoDB đang chạy
# Windows: Services -> MongoDB
# Mac/Linux: sudo systemctl status mongod
```

### Lỗi bcrypt

```bash
cd server
npm install bcrypt
```

### Lỗi TypeScript

```bash
cd server
npm install -D @types/bcrypt
```

### Không thấy dữ liệu sau seed

1. Kiểm tra console log xem có lỗi
2. Verify MongoDB connection string trong `.env`
3. Refresh browser (Ctrl+Shift+R)
4. Logout và login lại
