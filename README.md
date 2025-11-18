# MemoHub Backend - Smart Language Learning with SRS

## 🚀 Giới thiệu

Backend cho ứng dụng **MemoHub** - ứng dụng học từ vựng thông minh sử dụng thuật toán **Spaced Repetition System (SM-2)** để tối ưu hóa việc ghi nhớ.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
```

## 🏃 Chạy ứng dụng

```bash
# Development mode
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
```

## 📚 API Documentation

### Auth Module

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user (require JWT)

### Deck Module

- `POST /api/decks` - Tạo bộ từ mới
- `GET /api/decks/my` - Lấy tất cả bộ từ của user
- `DELETE /api/decks/:deckId` - Xóa bộ từ

### Card Module

- `POST /api/cards` - Thêm thẻ mới
- `GET /api/cards/byDeck/:deckId` - Lấy thẻ theo deck
- `PUT /api/cards/:cardId` - Cập nhật thẻ

### Study Module (Core SRS)

- `GET /api/study/session` - Lấy thẻ cần ôn hôm nay
- `POST /api/study/review/:cardId` - Đánh giá thẻ sau ôn tập

## 🧠 Thuật toán SRS (SM-2)

Ứng dụng sử dụng thuật toán SM-2 đơn giản hóa:

- **Grade < 3** (Again/Hard): Reset interval, giảm ease_factor
- **Grade >= 3** (Good/Easy): Tăng interval theo công thức `new_interval = old_interval * ease_factor`

## 📁 Cấu trúc thư mục

```
src/
├── models/          # Mongoose schemas
├── controllers/     # Request handlers
├── routes/          # API routes
├── middlewares/     # Custom middlewares (auth, validation)
├── services/        # Business logic (SRS algorithm)
├── utils/           # Helper functions
└── server.ts        # Entry point
```

## 🔒 Bảo mật

- Mật khẩu được hash với bcrypt (10 rounds)
- Authentication qua JWT tokens
- Protected routes với middleware xác thực

## 📝 License

MIT
