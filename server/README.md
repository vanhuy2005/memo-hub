# MemoHub Backend

Backend API cho ứng dụng MemoHub - Hệ thống học tập với Spaced Repetition System (SRS).

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: MongoDB với Mongoose 8.0
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, cors

## Cài đặt

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env (copy từ .env.example)
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
```

## Chạy Server

### Development mode (với nodemon)

```bash
npm run dev
```

### Production mode

```bash
npm run build
npm start
```

## API Endpoints

Xem chi tiết trong `../API_DOCUMENTATION.md`

### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Decks

- `GET /api/decks/my` - Lấy danh sách decks của user
- `POST /api/decks` - Tạo deck mới
- `GET /api/decks/:id` - Lấy chi tiết deck
- `PUT /api/decks/:id` - Cập nhật deck
- `DELETE /api/decks/:id` - Xóa deck

### Cards

- `GET /api/cards/byDeck/:deckId` - Lấy cards theo deck
- `POST /api/cards` - Tạo card mới
- `GET /api/cards/:id` - Lấy chi tiết card
- `PUT /api/cards/:id` - Cập nhật card
- `DELETE /api/cards/:id` - Xóa card

### Study (SRS)

- `GET /api/study/session` - Lấy phiên học (cards cần ôn)
- `POST /api/study/review/:cardId` - Review card với SRS algorithm
- `GET /api/study/stats` - Lấy thống kê học tập

## Cấu trúc thư mục

```text
backend/
├── src/
│   ├── models/          # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Deck.ts
│   │   └── Card.ts
│   ├── controllers/     # Request handlers
│   │   ├── authController.ts
│   │   ├── deckController.ts
│   │   ├── cardController.ts
│   │   └── studyController.ts
│   ├── services/        # Business logic
│   │   └── srsService.ts
│   ├── middlewares/     # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── deck.routes.ts
│   │   ├── card.routes.ts
│   │   └── study.routes.ts
│   └── server.ts        # Entry point
├── package.json
├── tsconfig.json
└── .env
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/memohub
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## SRS Algorithm

Backend sử dụng thuật toán **SM-2** (SuperMemo 2) để tính toán khoảng thời gian ôn tập:

- **Grade 0 (Again)**: interval = 1 phút, ease_factor giảm
- **Grade 1 (Hard)**: interval = 10 phút, ease_factor giảm nhẹ
- **Grade 2 (Good)**: interval tăng theo công thức SM-2
- **Grade 3 (Easy)**: interval tăng nhanh, ease_factor tăng

## Scripts

- `npm run dev` - Chạy development server với nodemon
- `npm run build` - Build TypeScript sang JavaScript
- `npm start` - Chạy production server
- `npm run lint` - Kiểm tra code style

## License

MIT
